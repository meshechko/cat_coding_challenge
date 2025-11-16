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

export interface MapBounds {
  maxX: number;
  maxY: number;
}

export enum ZoneType {
  Loading = 'loading',
  Dumping = 'dumping'
}

export enum TruckStatus {
  Loading = 'loading',
  Hauling = 'hauling',
  Dumping = 'dumping',
  Idle = 'idle'
}

export interface TruckState {
  id: string;
  speed: number;
  position: {
    x: number;
    y: number;
  };
  status: TruckStatus;
}