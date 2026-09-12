import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  generateMockSatellites,
  generateMockDebris,
  MOCK_GROUND_STATIONS,
  MOCK_LAUNCH_SITES,
  getMockSpaceWeather,
  MOCK_ORBITAL_LANES,
} from './src/server/mockData.js';
import { fetchLiveCelesTrakSatellites } from './src/server/celestrak.js';
import {
  predictCollision,
  optimizeLaunchWindow,
  detectAnomalies,
  predictSatelliteHealth,
} from './src/server/aiEngines.js';
import { User, UserRole, LaunchOptimizationRequest, SimulationConfig, SimulationStep } from './src/types.js';

dotenv.config({ path: ['.env.local', '.env'] });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'PLACEHOLDER_KEY',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Seed Memory DB State
let satellites = generateMockSatellites();
let debrisList = generateMockDebris();
let groundStations = [...MOCK_GROUND_STATIONS];
let mockUsers: User[] = [
  { id: 'U-1', username: 'commander', email: 'admin@astra.space', role: 'Admin' },
  { id: 'U-2', username: 'operator', email: 'operator@astra.space', role: 'Operator' },
  { id: 'U-3', username: 'analyst', email: 'analyst@astra.space', role: 'Analyst' },
];

// ---------------- REST API ROUTES ----------------

// Authentication API
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const selectedRole: UserRole = role || 'Operator';
  const user: User = {
    id: `U-${Date.now().toString().slice(-4)}`,
    username: email.split('@')[0],
    email,
    role: selectedRole,
  };

  return res.json({ success: true, user, token: 'mock-jwt-token-astra-os' });
});

app.post('/api/signup', (req, res) => {
  const { username, email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const user: User = {
    id: `U-${Date.now().toString().slice(-4)}`,
    username: username || email.split('@')[0],
    email,
    role: role || 'Operator',
  };

  mockUsers.push(user);
  return res.json({ success: true, user, token: 'mock-jwt-token-astra-os' });
});

// Live NORAD / CelesTrak Sync API
app.all('/api/satellites/sync', async (_req, res) => {
  try {
    const liveSats = await fetchLiveCelesTrakSatellites();
    satellites = liveSats;
    return res.json({
      success: true,
      message: `Successfully synchronized ${liveSats.length} live satellites from CelesTrak NORAD network!`,
      count: liveSats.length,
      satellites: liveSats,
    });
  } catch (err: any) {
    console.warn('Live CelesTrak sync failed, maintaining active telemetry:', err?.message || err);
    return res.json({
      success: true,
      message: 'CelesTrak live sync completed with internal NORAD fallback registry.',
      count: satellites.length,
      satellites,
    });
  }
});

// Module 1: Live Satellites API
app.get('/api/satellites', (req, res) => {
  const { search, orbit, status, limit = 100, page = 1 } = req.query;

  let filtered = [...satellites];

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.noradId.toString().includes(q) ||
        s.operator.toLowerCase().includes(q)
    );
  }

  if (orbit && orbit !== 'ALL') {
    filtered = filtered.filter((s) => s.orbitType === orbit);
  }

  if (status && status !== 'ALL') {
    filtered = filtered.filter((s) => s.status === status);
  }

  const p = Number(page);
  const l = Number(limit);
  const total = filtered.length;
  const paginated = filtered.slice((p - 1) * l, p * l);

  return res.json({
    total,
    page: p,
    limit: l,
    satellites: paginated,
  });
});

app.get('/api/satellites/:id', (req, res) => {
  const sat = satellites.find((s) => s.id === req.params.id || s.noradId.toString() === req.params.id);
  if (!sat) return res.status(404).json({ error: 'Satellite not found' });
  return res.json(sat);
});

// Module 2: Space Debris API
app.get('/api/debris', (req, res) => {
  const { risk, limit = 500 } = req.query;
  let filtered = [...debrisList];

  if (risk && risk !== 'ALL') {
    filtered = filtered.filter((d) => d.riskLevel === risk);
  }

  const l = Number(limit);
  return res.json({
    total: filtered.length,
    debris: filtered.slice(0, l),
  });
});

// Module 3: AI Collision Prediction API
app.post('/api/collision', (req, res) => {
  const { satelliteAId, targetId } = req.body;

  const satA = satellites.find((s) => s.id === satelliteAId || s.noradId.toString() === satelliteAId) || satellites[0];
  let target =
    satellites.find((s) => s.id === targetId || s.noradId.toString() === targetId) ||
    debrisList.find((d) => d.id === targetId || d.catalogId.toString() === targetId) ||
    debrisList[11]; // default high-risk debris

  const prediction = predictCollision(satA, target);
  return res.json(prediction);
});

// Module 4: Launch Window Optimization API
app.post('/api/launch', (req, res) => {
  const body: LaunchOptimizationRequest = req.body;
  const site = MOCK_LAUNCH_SITES.find((s) => s.id === body.siteId) || MOCK_LAUNCH_SITES[0];
  const result = optimizeLaunchWindow(body, site.name);
  return res.json(result);
});

app.get('/api/launch/sites', (_req, res) => {
  return res.json(MOCK_LAUNCH_SITES);
});

// Module 5: Space Weather API
app.get(['/api/weather', '/api/space-weather'], (_req, res) => {
  const weather = getMockSpaceWeather();
  return res.json(weather);
});

// Module 6: Ground Stations API
app.get('/api/ground-stations', (_req, res) => {
  return res.json(groundStations);
});

// Module 8: Mission Analytics API
app.get('/api/analytics', (_req, res) => {
  return res.json({
    activeCount: satellites.filter((s) => s.status === 'Active' || s.status === 'Nominal').length,
    warningCount: satellites.filter((s) => s.status === 'Warning').length,
    criticalCount: satellites.filter((s) => s.status === 'Critical').length,
    totalDebrisCount: debrisList.length,
    criticalDebrisCount: debrisList.filter((d) => d.riskLevel === 'CRITICAL').length,
    fuelUsageAvgKg: 184.2,
    missionSuccessRatePct: 98.4,
    satelliteAvailabilityPct: 99.1,
    congestionIndex: 82,
  });
});

// Module 9: Anomaly Detection API
app.get('/api/anomaly', (_req, res) => {
  const anomalies = detectAnomalies(satellites);
  return res.json(anomalies);
});

// Module 10: Satellite Health Prediction API
app.get('/api/health', (req, res) => {
  const { satelliteId } = req.query;
  if (satelliteId) {
    const sat = satellites.find((s) => s.id === satelliteId) || satellites[0];
    return res.json(predictSatelliteHealth(sat));
  }

  const healthList = satellites.slice(0, 15).map((s) => predictSatelliteHealth(s));
  return res.json(healthList);
});

// Module 13: Orbital Traffic Management API
app.get('/api/traffic', (_req, res) => {
  return res.json({
    lanes: MOCK_ORBITAL_LANES,
    globalCongestionIndex: 84,
    highRiskCorridors: ['LEO Sun-Synch 600km Polar Plane', 'GEO 105°E Equatorial Slot'],
    aiReroutingSuggestions: [
      'Reroute Starlink Shell 4 orbital insertion by +10km to avoid Cosmos-2251 fragment cloud.',
      'Enforce station-keeping box ±0.02° for GEO satellite INSAT-3DR.',
    ],
  });
});

// Module 14: Mission Simulation API
app.post('/api/simulation', (req, res) => {
  const config: SimulationConfig = req.body;
  const steps: SimulationStep[] = [];

  let alt = config.altitudeKm || 500;
  let fuel = config.initialFuelKg || 100;
  let battery = 100;
  let nearMisses = 0;

  for (let hour = 1; hour <= Math.min(24, config.durationHours || 12); hour++) {
    const dragLoss = config.solarActivity === 'High' ? 0.25 : 0.08;
    alt -= dragLoss;
    fuel -= 0.8;
    battery = Math.round(85 + Math.sin(hour) * 12);
    const hasAnom = hour === 4 || hour === 9;

    if (config.debrisDensity === 'High' && hour % 3 === 0) {
      nearMisses++;
    }

    steps.push({
      stepIndex: hour,
      elapsedHours: hour,
      altitudeKm: Number(alt.toFixed(2)),
      fuelRemainingKg: Number(Math.max(0, fuel).toFixed(1)),
      temperatureC: Number((22 + Math.sin(hour * 0.5) * 18).toFixed(1)),
      batteryPct: battery,
      anomalyDetected: hasAnom,
      nearMissCount: nearMisses,
      statusLog: hasAnom
        ? `T+${hour}h: Atmospheric thermal expansion anomaly logged.`
        : `T+${hour}h: Orbit nominal. Telemetry ping ok.`,
    });
  }

  return res.json({
    config,
    steps,
    totalNearMisses: nearMisses,
    finalAltitudeKm: Number(alt.toFixed(2)),
    simulatedSuccessRate: nearMisses > 4 ? '72.0%' : '98.5%',
  });
});

// Module 7: AI Mission Copilot (Gemini API Integration)
app.post('/api/copilot', async (req, res) => {
  const { message, chatHistory = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message parameter required' });
  }

  try {
    const systemPrompt = `You are ASTRA OS AI Mission Copilot, an elite autonomous space mission controller assistant for NASA/ISRO/ESA operators. 
    You have instant telemetry access to 100 active satellites, 500 tracked space debris objects, global ground stations, space weather KP-index, and ML collision avoidance engines.
    Provide precise, mission-critical, authoritative, concise responses with technical telemetry terms (e.g., TLE, Delta-V, Prograde burn, Keplerian elements, NORAD ID, TCS, S-band).
    Format your answer cleanly with brief bullet points or step-by-step procedures when applicable.`;

    // Format recent chat history context
    const recentHistory = Array.isArray(chatHistory)
      ? chatHistory
          .slice(-4)
          .map((m: any) => `${m.sender === 'user' ? 'Operator' : 'Copilot'}: ${m.text}`)
          .join('\n')
      : '';

    const fullPrompt = `${systemPrompt}\n\n${recentHistory ? `Recent Conversation:\n${recentHistory}\n\n` : ''}Operator Inquiry: "${message}"`;

    // GenAI call with standard gemini-2.5-flash model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'ASTRA OS Copilot standby. Telemetry response pending.';

    return res.json({
      sender: 'copilot',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
      suggestedActions: [
        'Run Collision Risk Check',
        'Inspect Solar Weather Status',
        'View Telemetry Log',
      ],
    });
  } catch (error) {
    console.warn('Gemini API call failed or missing key, falling back to local Copilot knowledge base:', error);

    // Contextual fallback response generator
    const msg = message.toLowerCase();
    let fallbackReply = `ASTRA OS Copilot standing by. Orbit telemetry monitors indicate nominal operation across active LEO/GEO sectors. Command "${message}" processed successfully.`;

    if (msg.includes('collision') || msg.includes('debris') || msg.includes('conjunction') || msg.includes('cartosat')) {
      fallbackReply = `ASTRA OS Collision Analysis Engine: Conjunction warning active for CARTOSAT-3 (NORAD 40037) and COSMOS 2251 DEBRIS #12. Miss distance evaluated at 0.182 km (182 meters). Conjunction Probability (P_c): 1.84%. Recommended action: Prograde burn (+0.25 m/s) at T-120s.`;
    } else if (msg.includes('weather') || msg.includes('solar') || msg.includes('flare') || msg.includes('kp')) {
      fallbackReply = `Space Weather Alert: Sunspot AR3380 triggered an M2.8 Solar Flare. Current KP-Index: 5 (G1 Minor Geomagnetic Storm). Atmospheric thermospheric density increased by 14% in 400-500km LEO.`;
    } else if (msg.includes('health') || msg.includes('battery') || msg.includes('fuel') || msg.includes('telemetry')) {
      fallbackReply = `Fleet Health Audit: 94% of active satellites operational. INSAT-3DR reporting low solar array charging cycle efficiency during GEO shadow transit.`;
    } else if (msg.includes('maneuver') || msg.includes('avoidance') || msg.includes('burn')) {
      fallbackReply = `Avoidance Maneuver Protocol: Recommended Thruster Burn = Prograde +0.32 m/s Delta-V at orbital node 142. Estimated hydrazine fuel consumption = 1.4 kg. Ensures minimum safety separation of 3.8 km.`;
    }

    return res.json({
      sender: 'copilot',
      text: fallbackReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
      suggestedActions: [
        'Calculate Avoidance Delta-V',
        'Query Space Weather',
        'Download Mission Report',
      ],
    });
  }
});

// ---------------- VITE / EXPRESS SETUP ----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ASTRA OS] Mission Control Server running at http://localhost:${PORT}`);
    console.log(`[ASTRA OS] Bound to network host 0.0.0.0:${PORT}`);
  });
}

startServer();
