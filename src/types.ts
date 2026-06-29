/**
 * Types and interfaces for the Pagbilao Municipality Monitoring System
 */

export type SeverityLevel = 'Normal' | 'Advisory' | 'Watch' | 'Warning' | 'Critical';

export interface Barangay {
  name: string;
  lat: number;
  lon: number;
  temp?: number;
  humidity?: number;
  windSpeed?: number;
  windDirection?: number;
  cloudCover?: number;
  precipitationProbability?: number;
  sunrise?: string;
  sunset?: string;
  floodLevel?: 'Normal' | 'Advisory' | 'Watch' | 'Warning' | 'Critical';
  landslideRisk?: 'Low' | 'Moderate' | 'High';
  uvIndex?: number;
  tideLevel?: string;
}

export type IncidentType = 'Flood' | 'Landslide' | 'Accident' | 'Fire' | 'Medical' | 'Other';

export interface Incident {
  id: string;
  type: IncidentType;
  location: string;
  details: string;
  severity: 'Advisory' | 'Watch' | 'Warning' | 'Critical';
  status: 'reported' | 'dispatched' | 'resolved';
  reportedAt: string;
  reporterName: string;
  reporterPhone: string;
}

export interface ResourceStatus {
  id: string;
  name: string;
  type: 'Ambulance' | 'Fire Truck' | 'Rescue Boat' | 'Police Cruiser' | 'Utility Truck';
  total: number;
  available: number;
  deployed: number;
  status: 'optimal' | 'limited' | 'critical';
}

export interface EnvironmentalSensor {
  id: string;
  name: string;
  location: string;
  type: 'Water Level' | 'Rain Gauge' | 'Air Quality';
  currentValue: number;
  unit: string;
  thresholdWarning: number;
  thresholdCritical: number;
  status: 'Normal' | 'Warning' | 'Critical';
}

export interface ActiveWarning {
  id: string;
  title: string;
  description: string;
  level: 'Advisory' | 'Watch' | 'Warning' | 'Critical';
  issuedAt: string;
  source: string;
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  rain: number;
  humidity: number;
  windSpeed: number;
  cloudCover: number;
}
