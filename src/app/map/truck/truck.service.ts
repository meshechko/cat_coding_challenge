import { Injectable } from "@angular/core";
import { MapBounds, TruckState, TruckStatus, Zone, ZoneType } from "../models/map.models";
import { BehaviorSubject, interval } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TruckService {
  private zones: Zone[] = [];
  private bounds: MapBounds = { maxX: 0, maxY: 0 };
  private currentZoneIndex: number = 0;

  public initialTruckState: TruckState = {
    id: 'T-001',
    speed: 0,
    position: { x: 500, y: 400 },
    status: TruckStatus.Idle,
  };

  private truckStateSubject$ = new BehaviorSubject<TruckState>(this.initialTruckState);
  public readonly truckState$ = this.truckStateSubject$.asObservable();

  public initialize(zones: Zone[], bounds: MapBounds): void {
    this.zones = zones;
    this.bounds = bounds;
    this.startTruckMovementSimulation();
  }

  public startTruckMovementSimulation(): void {
    interval(2000).subscribe(() => this.moveTruck());
  }

  private moveTruck(): void {
    const MIN_STEP = 80;
    const MAX_STEP = 120;
    
    const currentZone = this.zones[this.currentZoneIndex];
    let currentState = this.truckStateSubject$.value;
    const target = this.getRandomPointInZone(currentZone);
    const delta = this.calculateDelta(target, currentState);
    const distanceToTarget = Math.hypot(delta.dx, delta.dy);
    const step = this.getRandomInt(MIN_STEP, MAX_STEP);
    
    if (this.hasReachedTarget(distanceToTarget, step)) {
      currentState = this.directToNextTarget(target, currentState);
    } else {
      currentState = this.updateTruckPosition(delta, distanceToTarget, step, this.bounds, currentState);
    }
    
    currentState = this.updateStatus(currentState);
    this.truckStateSubject$.next(currentState);
  }

  private calculateDelta(target: { x: number; y: number }, state: TruckState): { dx: number; dy: number } {
    return {
      dx: target.x - state.position.x,
      dy: target.y - state.position.y
    };
  }

  private hasReachedTarget(distance: number, threshold: number): boolean {
    return distance < threshold;
  }

  private directToNextTarget(target: { x: number; y: number }, state: TruckState): TruckState {
    this.currentZoneIndex = (this.currentZoneIndex + 1) % this.zones.length;
    return {
      ...state,
      speed: 0,
      position: { x: target.x, y: target.y }
    };
  }

  private updateTruckPosition(
    delta: { dx: number; dy: number },
    distance: number,
    step: number,
    bounds: MapBounds,
    state: TruckState
  ): TruckState {    
    if (this.stopOccasionally()) {
      return { ...state, speed: 0 };
    }

    const RANDOM_OFFSET_X = this.getRandomInt(0, 30); 
    const RANDOM_OFFSET_Y = this.getRandomInt(0, 30); 
    const moveX = (delta.dx / distance) * step + RANDOM_OFFSET_X;
    const moveY = (delta.dy / distance) * step + RANDOM_OFFSET_Y;
    
    return {
      ...state,
      position: {
        x: this.clamp(state.position.x + moveX, bounds.maxX),
        y: this.clamp(state.position.y + moveY, bounds.maxY)
      },
      speed: Math.floor(step / 2)
    };
  }

  private stopOccasionally(): boolean {
    const STOP_CHANCE = 0.2;
    return Math.random() < STOP_CHANCE;
  }

  private getRandomInt(min: number, max: number) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, value));
  }

  private getRandomPointInZone(zone: Zone): { x: number; y: number } {
    return {
      x: zone.x + Math.random() * zone.width,
      y: zone.y + Math.random() * zone.height
    };
  }

  private updateStatus(state: TruckState): TruckState {
    const currentZone = this.zones.find(zone =>
      this.isInZone(state.position.x, state.position.y, zone)
    );

    let newStatus = state.status;

    if (currentZone) {
      if (currentZone.type === ZoneType.Loading) {
        newStatus = TruckStatus.Loading;
      } else if (currentZone.type === ZoneType.Dumping) {
        newStatus = TruckStatus.Dumping;
      }
    } else if (state.speed > 0) {
      newStatus = TruckStatus.Hauling;
    } else {
      newStatus = TruckStatus.Idle;
    }

    return { ...state, status: newStatus };
  }

  private isInZone(x: number, y: number, zone: Zone): boolean {
    return (
      x >= zone.x &&
      x <= zone.x + zone.width &&
      y >= zone.y &&
      y <= zone.y + zone.height
    );
  }
}