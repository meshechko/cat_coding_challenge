import { Injectable } from "@angular/core";
import { TruckState, TruckStatus } from "../models/map.models";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TruckService {

  public initialTruckState: TruckState = {
    id: 'T-001',
    speed: 0,
    position: { x: 500, y: 400 },
    status: TruckStatus.Idle,
  };

  private truckStateSubject$ = new BehaviorSubject<TruckState>(this.initialTruckState);
  public readonly truckState$ = this.truckStateSubject$.asObservable();
}