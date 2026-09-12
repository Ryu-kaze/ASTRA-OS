export type UserRole = 'Admin' | 'Operator' | 'Analyst';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type OrbitType = 'LEO' | 'MEO' | 'GEO' | 'HEO';
export type SatelliteStatus = 'Active' | 'Nominal' | 'Warning' | 'Critical' | 'Offline';

export interface Satellite {
  id: string;
  name: string;
  noradId: number;
  latitude: number;
  longitude: number;
  altitude: number; // in km
  velocity: number; // in km/s
  orbitType: OrbitType;
  status: SatelliteStatus;
  country: string;
  operator: string;
  launchDate: string;
  inclination: number; // degrees
  batteryLevel: number; // %
  fuelLevel: number; // kg
  temperature: number; // Celsius
  healthScore: number; // 0 - 100
  estimatedLifeRemainingMonths: number;
}

export type DebrisRiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface DebrisObject {
  id: string;
  name: string;
  catalogId: number;
  latitude: number;
  longitude: number;
  altitude: number; // in km
  velocity: number; // in km/s
  size: 'Micro (<1cm)' | 'Small (1-10cm)' | 'Medium (10-50cm)' | 'Large (>50cm)';
  rcs: number; // Radar Cross Section sq meters
  origin: string;
  closestSatelliteId?: string;
  closestSatelliteName?: string;
  impactProbability: number; // %
  riskLevel: DebrisRiskLevel;
}

export interface CollisionPrediction {
  satelliteA: Satellite;
  satelliteB: Satellite | DebrisObject;
  probability: number; // %
  minimumDistanceKm: number; // km
  timeUntilEncounterSeconds: number; // seconds
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  confidenceScore: number; // %
  recommendedManeuver: string;
  deltaVRequired: number; // m/s
  fuelCostKg: number;
}

export interface LaunchSite {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface LaunchOptimizationRequest {
  siteId: string;
  targetOrbit: OrbitType;
  payloadMassKg: number;
  solarActivityLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  desiredDate: string;
}

export interface LaunchOptimizationResult {
  bestLaunchTimeUTC: string;
  windowDurationMinutes: number;
  riskScore: number; // 0-100
  fuelEstimateTons: number;
  deltaVBudgetMs: number;
  weatherFeasibility: number; // %
  aiRecommendation: string;
}

export interface SpaceWeatherReport {
  kpIndex: number; // 0 to 9
  kpStatus: 'QUIET' | 'UNSETTLED' | 'ACTIVE' | 'MINOR STORM' | 'MAJOR STORM' | 'SEVERE STORM';
  solarFlareClass: 'A' | 'B' | 'C' | 'M' | 'X';
  solarFlareIntensity: string; // e.g., X1.4
  solarWindSpeedKmS: number;
  geomagneticStormClass: 'G0' | 'G1' | 'G2' | 'G3' | 'G4' | 'G5';
  radiationBeltIndex: 'Normal' | 'Elevated' | 'Extreme';
  forecast24h: { time: string; kp: number; radiation: number }[];
  impactedSatellitesCount: number;
  alerts: string[];
}

export interface GroundStation {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'ONLINE' | 'MAINTENANCE' | 'OFFLINE';
  signalStrengthDbm: number;
  currentContactSatId?: string;
  currentContactSatName?: string;
  nextPassTimeUTC: string;
  downtimeHours: number;
  frequencyBand: string;
}

export interface AnomalyRecord {
  id: string;
  satelliteId: string;
  satelliteName: string;
  timestamp: string;
  type: 'Orbital Drift' | 'Temperature Spike' | 'Battery Degradation' | 'Comm Failure' | 'Attitude Loss';
  severity: 'Critical' | 'Warning' | 'Info';
  score: number; // Isolation forest anomaly score 0-1
  metricValue: string;
  expectedValue: string;
  rootCause: string;
  recommendedAction: string;
}

export interface SatelliteHealth {
  satelliteId: string;
  satelliteName: string;
  batteryRemainingPct: number;
  fuelRemainingKg: number;
  solarArrayEfficiencyPct: number;
  commLinkQualityDbm: number;
  componentHealthScore: number;
  estimatedRemainingLifetimeYears: number;
  predictedFailureRisk30d: number; // %
  alerts: string[];
}

export interface OrbitalLane {
  id: string;
  name: string;
  altitudeRangeKm: string;
  densityIndex: number; // 0-100
  activeCount: number;
  debrisCount: number;
  riskStatus: 'Safe' | 'Moderate' | 'Congested' | 'Critical';
  recommendedTransitRoute: string;
}

export interface SimulationConfig {
  satName: string;
  noradId: number;
  altitudeKm: number;
  inclinationDeg: number;
  initialFuelKg: number;
  solarActivity: 'Low' | 'Medium' | 'High';
  debrisDensity: 'Low' | 'Medium' | 'High';
  durationHours: number;
}

export interface SimulationStep {
  stepIndex: number;
  elapsedHours: number;
  altitudeKm: number;
  fuelRemainingKg: number;
  temperatureC: number;
  batteryPct: number;
  anomalyDetected: boolean;
  nearMissCount: number;
  statusLog: string;
}

export interface MissionReportData {
  reportId: string;
  generatedAt: string;
  title: string;
  author: string;
  summary: string;
  activeSatellites: number;
  criticalAlerts: number;
  weatherSummary: string;
  topRisks: string[];
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
