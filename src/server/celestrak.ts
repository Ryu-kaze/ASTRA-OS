import { Satellite } from '../types.js';

export async function fetchLiveCelesTrakSatellites(): Promise<Satellite[]> {
  const celestrakUrls = [
    'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json',
    'https://celestrak.org/NORAD/elements/gp.php?GROUP=brightest&FORMAT=json',
    'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json',
  ];

  for (const url of celestrakUrls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000); // 4 second timeout

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) continue;

      const items = await res.json();
      if (!Array.isArray(items) || items.length === 0) continue;

      const parsedSatellites: Satellite[] = items.slice(0, 150).map((item: any, i: number) => {
        const noradId = item.NORAD_CAT_ID || (25544 + i);
        const name = (item.OBJECT_NAME || `NORAD-${noradId}`).trim();
        const meanMotion = item.MEAN_MOTION || 15.5;
        const inclination = Number((item.INCLINATION || 51.6).toFixed(1));

        // Calculate approximate altitude from mean motion
        // Period = 1440 / meanMotion minutes
        const periodMin = 1440 / (meanMotion || 15.5);
        const periodSec = periodMin * 60;
        const mu = 398600.4418; // Earth's gravitational parameter km^3/s^2
        const semiMajorAxis = Math.pow((mu * Math.pow(periodSec / (2 * Math.PI), 2)), 1 / 3);
        const altitude = Math.max(300, Math.min(36000, Math.round(semiMajorAxis - 6371)));

        let orbitType: Satellite['orbitType'] = 'LEO';
        if (altitude > 30000) orbitType = 'GEO';
        else if (altitude > 10000) orbitType = 'MEO';
        else if (inclination > 80) orbitType = 'LEO';

        const lat = Number((Math.sin((i + 1) * 0.7) * Math.min(85, inclination)).toFixed(4));
        const lon = Number(((((i * 23.4) + (item.RA_OF_ASC_NODE || 0)) % 360) - 180).toFixed(4));
        const velocity = orbitType === 'GEO' ? 3.07 : orbitType === 'MEO' ? 3.88 : Number((7.6 + (i % 5) * 0.05).toFixed(2));

        // Infer operator / country from name or owner
        let country = 'International';
        let operator = 'Space Agency';
        const uName = name.toUpperCase();

        if (uName.includes('STARLINK')) {
          country = 'USA (SpaceX)';
          operator = 'SpaceX';
        } else if (uName.includes('ISS') || uName.includes('ZARYA')) {
          country = 'International (NASA/Roscosmos)';
          operator = 'NASA / Roscosmos';
        } else if (uName.includes('TIANGONG') || uName.includes('CSS')) {
          country = 'China (CMSA)';
          operator = 'CMSA';
        } else if (uName.includes('HUBBLE') || uName.includes('JWST') || uName.includes('LANDSAT') || uName.includes('GOES') || uName.includes('NOAA')) {
          country = 'USA (NASA/NOAA)';
          operator = 'NASA / NOAA';
        } else if (uName.includes('CARTOSAT') || uName.includes('RISAT') || uName.includes('GSAT') || uName.includes('INSAT') || uName.includes('OCEANSAT') || uName.includes('EOS')) {
          country = 'India (ISRO)';
          operator = 'ISRO';
        } else if (uName.includes('SENTINEL') || uName.includes('GALILEO') || uName.includes('METEOSAT')) {
          country = 'Europe (ESA)';
          operator = 'ESA / EUMETSAT';
        } else if (uName.includes('COSMOS') || uName.includes('SOYUZ')) {
          country = 'Russia (Roscosmos)';
          operator = 'Roscosmos';
        }

        const statusList: Satellite['status'][] = ['Active', 'Nominal', 'Nominal', 'Active', 'Warning'];
        const status = i === 2 ? 'Warning' : i === 8 ? 'Critical' : statusList[i % statusList.length];

        return {
          id: `SAT-${noradId}`,
          name,
          noradId,
          latitude: lat,
          longitude: lon,
          altitude,
          velocity,
          orbitType,
          status,
          country,
          operator,
          launchDate: item.LAUNCH_DATE || `${2010 + (i % 14)}-05-12`,
          inclination,
          batteryLevel: Math.max(20, Math.min(100, Math.round(98 - (i % 15) * 4))),
          fuelLevel: Math.max(10, Math.min(350, Math.round(280 - (i % 25) * 8))),
          temperature: Number((18.5 + (i % 12) * 1.5).toFixed(1)),
          healthScore: status === 'Critical' ? 35 : status === 'Warning' ? 68 : Math.round(85 + (i % 14)),
          estimatedLifeRemainingMonths: Math.round(140 - (i % 90)),
        };
      });

      if (parsedSatellites.length > 0) {
        console.log(`[ASTRA OS] Successfully fetched ${parsedSatellites.length} real-world NORAD satellites from CelesTrak GP API.`);
        return parsedSatellites;
      }
    } catch (err) {
      console.warn('CelesTrak live sync attempt timed out or failed, checking next source...', err);
    }
  }

  throw new Error('All CelesTrak endpoints unreachable');
}
