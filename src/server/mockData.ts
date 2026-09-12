import {
  Satellite,
  DebrisObject,
  GroundStation,
  SpaceWeatherReport,
  AnomalyRecord,
  OrbitalLane,
  LaunchSite,
} from '../types.js';

// Seed 100 Realistic Satellites
export function generateMockSatellites(): Satellite[] {
  const satTemplates = [
    { name: 'CARTOSAT-3', country: 'India (ISRO)', operator: 'ISRO', orbit: 'LEO' },
    { name: 'RISAT-2BR1', country: 'India (ISRO)', operator: 'ISRO', orbit: 'LEO' },
    { name: 'GSAT-30', country: 'India (ISRO)', operator: 'ISRO', orbit: 'GEO' },
    { name: 'INSAT-3DR', country: 'India (ISRO)', operator: 'ISRO', orbit: 'GEO' },
    { name: 'OCEANSAT-3', country: 'India (ISRO)', operator: 'ISRO', orbit: 'LEO' },
    { name: 'CHANDRAYAAN-3 ORBITER', country: 'India (ISRO)', operator: 'ISRO', orbit: 'HEO' },
    { name: 'ISS (ZARYA)', country: 'International', operator: 'NASA/Roscosmos', orbit: 'LEO' },
    { name: 'HUBBLE SPACE TELESCOPE', country: 'USA (NASA)', operator: 'NASA', orbit: 'LEO' },
    { name: 'JAMES WEBB (JWST)', country: 'USA (NASA/ESA)', operator: 'NASA/ESA', orbit: 'HEO' },
    { name: 'STARLINK-5211', country: 'USA (SpaceX)', operator: 'SpaceX', orbit: 'LEO' },
    { name: 'STARLINK-4109', country: 'USA (SpaceX)', operator: 'SpaceX', orbit: 'LEO' },
    { name: 'STARLINK-3304', country: 'USA (SpaceX)', operator: 'SpaceX', orbit: 'LEO' },
    { name: 'ONEWEB-0284', country: 'UK (OneWeb)', operator: 'OneWeb', orbit: 'LEO' },
    { name: 'GPS III-SV05', country: 'USA (USSF)', operator: 'US Space Force', orbit: 'MEO' },
    { name: 'GALILEO-28', country: 'Europe (ESA)', operator: 'ESA', orbit: 'MEO' },
    { name: 'METEOSAT-11', country: 'Europe (EUMETSAT)', operator: 'EUMETSAT', orbit: 'GEO' },
    { name: 'SENTINEL-2A', country: 'Europe (ESA)', operator: 'ESA', orbit: 'LEO' },
    { name: 'LANDSAT-9', country: 'USA (NASA/USGS)', operator: 'NASA', orbit: 'LEO' },
    { name: 'COSMOS-2558', country: 'Russia (Roscosmos)', operator: 'Roscosmos', orbit: 'LEO' },
    { name: 'TIANGONG SPACE STATION', country: 'China (CMSA)', operator: 'CMSA', orbit: 'LEO' },
    { name: 'YAOGAN-35', country: 'China (CNSA)', operator: 'CNSA', orbit: 'LEO' },
    { name: 'FENGYUN-4B', country: 'China (CMA)', operator: 'CMA', orbit: 'GEO' },
    { name: 'IRIDIUM-NEXT 162', country: 'USA (Iridium)', operator: 'Iridium', orbit: 'LEO' },
    { name: 'AMAZONIA-1', country: 'Brazil (INPE)', operator: 'INPE', orbit: 'LEO' },
    { name: 'GOES-18', country: 'USA (NOAA)', operator: 'NOAA', orbit: 'GEO' },
  ];

  const satellites: Satellite[] = [];

  for (let i = 1; i <= 100; i++) {
    const template = satTemplates[(i - 1) % satTemplates.length];
    const isCustomIndex = i > satTemplates.length;
    const name = isCustomIndex ? `${template.name}-${1000 + i}` : template.name;
    const noradId = 40000 + i * 37;

    let alt = 550;
    if (template.orbit === 'MEO') alt = 20200 + (i % 5) * 100;
    else if (template.orbit === 'GEO') alt = 35786 + (i % 3) * 10;
    else if (template.orbit === 'HEO') alt = 42000 + (i % 7) * 500;
    else alt = 400 + (i % 25) * 20;

    const lat = Number(((Math.sin(i * 0.5) * 85)).toFixed(4));
    const lon = Number((((i * 13.7) % 360) - 180).toFixed(4));
    const vel = template.orbit === 'GEO' ? 3.07 : template.orbit === 'MEO' ? 3.88 : Number((7.6 + (i % 10) * 0.05).toFixed(2));

    const statusList: Satellite['status'][] = ['Active', 'Nominal', 'Nominal', 'Active', 'Warning', 'Critical', 'Offline'];
    const status = i === 3 ? 'Critical' : i === 7 ? 'Warning' : statusList[i % statusList.length];

    satellites.push({
      id: `SAT-${noradId}`,
      name,
      noradId,
      latitude: lat,
      longitude: lon,
      altitude: Math.round(alt),
      velocity: vel,
      orbitType: template.orbit as Satellite['orbitType'],
      status,
      country: template.country,
      operator: template.operator,
      launchDate: `${2015 + (i % 9)}-0${(i % 9) + 1}-15`,
      inclination: Number((28.5 + (i % 70) * 0.8).toFixed(1)),
      batteryLevel: Math.max(15, Math.min(100, Math.round(98 - (i % 20) * 3.5))),
      fuelLevel: Math.max(5, Math.min(300, Math.round(250 - (i % 30) * 7.2))),
      temperature: Number((18.5 + (i % 15) * 1.2 - (i % 4) * 2.1).toFixed(1)),
      healthScore: status === 'Critical' ? 32 : status === 'Warning' ? 68 : Math.round(88 + (i % 12)),
      estimatedLifeRemainingMonths: Math.round(120 - (i % 80)),
    });
  }

  return satellites;
}

// Seed 500 Space Debris Objects
export function generateMockDebris(): DebrisObject[] {
  const debrisPrefixes = [
    'COSMOS 2251 DEBRIS',
    'FENGYUN 1C FRAGMENT',
    'IRIDIUM 33 DEBRIS',
    'WESTFORD NEEDLES CLUSTER',
    'SL-16 R/B DEBRIS',
    'DELTA 2 UPPER STAGE DEBRIS',
    'ARIANE 4 ROCKET BODY',
    'CZ-3B STAGE FRAGMENT',
    'TITAN IIIC DEBRIS',
    'PEGASUS HABITAT DEBRIS',
  ];

  const debrisList: DebrisObject[] = [];

  for (let i = 1; i <= 500; i++) {
    const catalogId = 80000 + i;
    const prefix = debrisPrefixes[i % debrisPrefixes.length];
    const name = `${prefix} #${i}`;
    const lat = Number((Math.sin(i * 0.3) * 88).toFixed(4));
    const lon = Number((((i * 17.3) % 360) - 180).toFixed(4));
    const alt = Math.round(350 + (i * 2.8) % 1200);
    const vel = Number((7.2 + (i % 8) * 0.12).toFixed(2));

    const sizeTypes: DebrisObject['size'][] = [
      'Micro (<1cm)',
      'Small (1-10cm)',
      'Medium (10-50cm)',
      'Large (>50cm)',
    ];
    const size = sizeTypes[i % sizeTypes.length];
    const rcs = Number((0.001 + (i % 50) * 0.08).toFixed(3));

    let impactProb = Number(((i % 100) < 5 ? (0.12 + (i % 8) * 0.25) : (i % 20) * 0.004 + 0.0001).toFixed(4));
    if (i === 12) impactProb = 1.84;
    if (i === 45) impactProb = 0.94;
    if (i === 109) impactProb = 0.42;

    let riskLevel: DebrisObject['riskLevel'] = 'LOW';
    if (impactProb >= 0.10) riskLevel = 'CRITICAL';
    else if (impactProb >= 0.01) riskLevel = 'HIGH';
    else if (impactProb >= 0.001) riskLevel = 'MODERATE';

    debrisList.push({
      id: `DEB-${catalogId}`,
      name,
      catalogId,
      latitude: lat,
      longitude: lon,
      altitude: alt,
      velocity: vel,
      size,
      rcs,
      origin: prefix.split(' ')[0],
      closestSatelliteId: i % 3 === 0 ? `SAT-40111` : `SAT-40222`,
      closestSatelliteName: i % 3 === 0 ? 'CARTOSAT-3' : 'ISS (ZARYA)',
      impactProbability: impactProb,
      riskLevel,
    });
  }

  return debrisList;
}

// Seed Ground Stations
export const MOCK_GROUND_STATIONS: GroundStation[] = [
  {
    id: 'GS-BLR',
    name: 'ISRO Telemetry Station (ISTRAC)',
    location: 'Bengaluru, India',
    latitude: 12.9716,
    longitude: 77.5946,
    status: 'ONLINE',
    signalStrengthDbm: -68.4,
    currentContactSatId: 'SAT-40037',
    currentContactSatName: 'CARTOSAT-3',
    nextPassTimeUTC: 'In 12 mins',
    downtimeHours: 0.2,
    frequencyBand: 'S-Band / X-Band',
  },
  {
    id: 'GS-GDS',
    name: 'NASA Goldstone Deep Space Network',
    location: 'Mojave Desert, USA',
    latitude: 35.4266,
    longitude: -116.89,
    status: 'ONLINE',
    signalStrengthDbm: -62.1,
    currentContactSatId: 'SAT-40296',
    currentContactSatName: 'JAMES WEBB (JWST)',
    nextPassTimeUTC: 'Active Now',
    downtimeHours: 0.0,
    frequencyBand: 'Ka-Band / X-Band',
  },
  {
    id: 'GS-SVA',
    name: 'Svalbard Satellite Station (SvalSat)',
    location: 'Longyearbyen, Norway',
    latitude: 78.2232,
    longitude: 15.6267,
    status: 'ONLINE',
    signalStrengthDbm: -71.5,
    currentContactSatId: 'SAT-40222',
    currentContactSatName: 'ISS (ZARYA)',
    nextPassTimeUTC: 'In 04 mins',
    downtimeHours: 0.1,
    frequencyBand: 'X-Band',
  },
  {
    id: 'GS-MAD',
    name: 'ESA Madrid Deep Space Communication Complex',
    location: 'Robledo de Chavela, Spain',
    latitude: 40.4283,
    longitude: -4.2497,
    status: 'ONLINE',
    signalStrengthDbm: -64.8,
    currentContactSatId: 'SAT-40592',
    currentContactSatName: 'SENTINEL-2A',
    nextPassTimeUTC: 'In 28 mins',
    downtimeHours: 0.5,
    frequencyBand: 'S-Band / Ku-Band',
  },
  {
    id: 'GS-CBR',
    name: 'Canberra Deep Space Communication Complex',
    location: 'Tidbinbilla, Australia',
    latitude: -35.4014,
    longitude: 148.9817,
    status: 'ONLINE',
    signalStrengthDbm: -69.2,
    currentContactSatId: 'SAT-40481',
    currentContactSatName: 'GALILEO-28',
    nextPassTimeUTC: 'Active Now',
    downtimeHours: 0.0,
    frequencyBand: 'X-Band / Ka-Band',
  },
  {
    id: 'GS-KOU',
    name: 'Guiana Space Centre Tracking Station',
    location: 'Kourou, French Guiana',
    latitude: 5.1597,
    longitude: -52.6503,
    status: 'MAINTENANCE',
    signalStrengthDbm: -92.0,
    nextPassTimeUTC: 'In 2 hours',
    downtimeHours: 4.5,
    frequencyBand: 'C-Band',
  },
];

// Seed Launch Sites
export const MOCK_LAUNCH_SITES: LaunchSite[] = [
  { id: 'LS-SDSC', name: 'Satish Dhawan Space Centre (SDSC SHAR)', country: 'India', latitude: 13.7199, longitude: 80.2304 },
  { id: 'LS-CCAFS', name: 'Cape Canaveral Space Force Station', country: 'USA', latitude: 28.3922, longitude: -80.6077 },
  { id: 'LS-VSFB', name: 'Vandenberg Space Force Base', country: 'USA', latitude: 34.742, longitude: -120.5724 },
  { id: 'LS-CSG', name: 'Guiana Space Centre (Kourou)', country: 'French Guiana (ESA)', latitude: 5.236, longitude: -52.768 },
  { id: 'LS-BAI', name: 'Baikonur Cosmodrome', country: 'Kazakhstan', latitude: 45.965, longitude: 63.305 },
];

// Seed Space Weather
export function getMockSpaceWeather(): SpaceWeatherReport {
  return {
    kpIndex: 5,
    kpStatus: 'MINOR STORM',
    solarFlareClass: 'M',
    solarFlareIntensity: 'M2.8',
    solarWindSpeedKmS: 540,
    geomagneticStormClass: 'G1',
    radiationBeltIndex: 'Elevated',
    forecast24h: [
      { time: '00:00 UTC', kp: 3, radiation: 12 },
      { time: '04:00 UTC', kp: 4, radiation: 22 },
      { time: '08:00 UTC', kp: 6, radiation: 58 },
      { time: '12:00 UTC', kp: 5, radiation: 45 },
      { time: '16:00 UTC', kp: 4, radiation: 30 },
      { time: '20:00 UTC', kp: 3, radiation: 18 },
    ],
    impactedSatellitesCount: 14,
    alerts: [
      'G1 Minor Geomagnetic Storm Warning active until 18:00 UTC.',
      'M2.8 Solar Flare erupted from Sunspot AR3380.',
      'Increased atmospheric drag detected in 400km-500km LEO orbital shell.',
    ],
  };
}

// Seed Anomalies
export const MOCK_ANOMALIES: AnomalyRecord[] = [
  {
    id: 'ANOM-101',
    satelliteId: 'SAT-40111',
    satelliteName: 'CARTOSAT-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    type: 'Orbital Drift',
    severity: 'Critical',
    score: 0.92,
    metricValue: '-1.42 km/day',
    expectedValue: '-0.05 km/day',
    rootCause: 'Enhanced thermospheric solar drag due to coronal mass ejection.',
    recommendedAction: 'Fire RCS thruster 2 for 4.2 seconds to boost perigee altitude by +1.8km.',
  },
  {
    id: 'ANOM-102',
    satelliteId: 'SAT-40222',
    satelliteName: 'ISS (ZARYA)',
    timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    type: 'Temperature Spike',
    severity: 'Warning',
    score: 0.78,
    metricValue: '68.4 °C',
    expectedValue: '22.0 °C',
    rootCause: 'Radiator panel beta-cloth thermal degradation during sunlit orbit passage.',
    recommendedAction: 'Adjust solar array pitch angle by -15 degrees to optimize shading.',
  },
  {
    id: 'ANOM-103',
    satelliteId: 'SAT-40518',
    satelliteName: 'INSAT-3DR',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    type: 'Battery Degradation',
    severity: 'Warning',
    score: 0.71,
    metricValue: '42% Capacity',
    expectedValue: '88% Capacity',
    rootCause: 'Shortened eclipse charge cycle in GEO shadow transition zone.',
    recommendedAction: 'Switch non-essential payload instruments to standby power conserve mode.',
  },
];

// Seed Orbital Lanes
export const MOCK_ORBITAL_LANES: OrbitalLane[] = [
  { id: 'LANE-LEO-LOW', name: 'LEO Shell Alpha (300-500km)', altitudeRangeKm: '300 - 500 km', densityIndex: 88, activeCount: 642, debrisCount: 2140, riskStatus: 'Congested', recommendedTransitRoute: 'Ascend to 550km via 12-deg inclination offset' },
  { id: 'LANE-LEO-MID', name: 'LEO Shell Beta (500-800km)', altitudeRangeKm: '500 - 800 km', densityIndex: 94, activeCount: 1850, debrisCount: 4890, riskStatus: 'Critical', recommendedTransitRoute: 'Execute avoidance corridors around Sun-Synch nodes' },
  { id: 'LANE-MEO-GPS', name: 'MEO Navigation Belt (19000-22000km)', altitudeRangeKm: '19000 - 22000 km', densityIndex: 32, activeCount: 120, debrisCount: 140, riskStatus: 'Safe', recommendedTransitRoute: 'Standard Keplerian phasing' },
  { id: 'LANE-GEO-CLT', name: 'GEO Equatorial Ring (35786km)', altitudeRangeKm: '35786 km', densityIndex: 76, activeCount: 410, debrisCount: 920, riskStatus: 'Moderate', recommendedTransitRoute: 'Maintain longitudinal station-keeping window ±0.05°' },
];
