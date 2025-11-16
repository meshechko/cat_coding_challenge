export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface MapInfo {
  siteName: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  metadata: {
    createdAt: string;
    lastUpdated: string;
  };
  zones: Zone[];
}

export enum ZoneType {
  Loading = 'loading',
  Dumping = 'dumping'
}