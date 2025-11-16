import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { MapInfo } from './models/map.models';

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