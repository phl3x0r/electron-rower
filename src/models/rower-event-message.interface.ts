import { FieldType } from 'influx';

// example interface..
export interface RowerEventMessage {
  totalTime: number;
  distance: number;
  timeTo500m: number;
  spm: number;
  watt: number;
  calph: number;
  level: number;
}

export interface InfluxRowerEventMessage {
  totalTime: FieldType.INTEGER;
  distance: FieldType.INTEGER;
  timeTo500m: FieldType.INTEGER;
  spm: FieldType.INTEGER;
  watt: FieldType.INTEGER;
  calph: FieldType.INTEGER;
  level: FieldType.INTEGER;
}
