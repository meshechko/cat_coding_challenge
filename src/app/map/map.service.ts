import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';

export interface Zone {
  id: string;
  type: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
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

@Injectable({
  providedIn: 'root'
})
export class MapService {
   private readonly http = inject(HttpClient);

  public loadMap$(): Observable<MapInfo> {
    return this.http.get<MapInfo>('mock-data/map.json').pipe(
      delay(500)
    );
  }
}