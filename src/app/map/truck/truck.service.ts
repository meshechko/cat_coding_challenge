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
    const currentState = this.truckStateSubject$.value;
    const target = this.getRandomPointInZone(currentZone);
    const delta = this.calculateDelta(target, currentState);
    const distanceToTarget = Math.hypot(delta.dx, delta.dy);
    const step = this.getRandomInt(MIN_STEP, MAX_STEP);
    
    if (this.hasReachedTarget(distanceToTarget, step)) {
      this.directToNextTarget(target, currentState);
    } else {
      this.updateTruckPosition(delta, distanceToTarget, step, this.bounds, currentState);
    }
    this.updateStatus(currentState);
    this.truckStateSubject$.next({...currentState});
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

  private directToNextTarget(target: { x: number; y: number }, state: TruckState): void {
    this.currentZoneIndex = (this.currentZoneIndex + 1) % this.zones.length;
    state.speed = 0;
    state.position.x = target.x;
    state.position.y = target.y;
  }

  private updateTruckPosition(
    delta: { dx: number; dy: number },
    distance: number,
    step: number,
    bounds: MapBounds,
    state: TruckState
  ): void {
    const RANDOM_OFFSET_X = this.getRandomInt(0, 30); 
    const RANDOM_OFFSET_Y = this.getRandomInt(0, 30); 
    const moveX = (delta.dx / distance) * step + RANDOM_OFFSET_X;
    const moveY = (delta.dy / distance) * step + RANDOM_OFFSET_Y;
    
    state.position.x = this.clamp(state.position.x + moveX, bounds.maxX);
    state.position.y = this.clamp(state.position.y + moveY, bounds.maxY);
    state.speed = Math.floor(step);
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

  private updateStatus(state: TruckState): void {
    const currentZone = this.zones.find(zone =>
      this.isInZone(state.position.x, state.position.y, zone)
    );

    if (currentZone) {
      if (currentZone.type === ZoneType.Loading) {
        state.status = TruckStatus.Loading;
      } else if (currentZone.type === ZoneType.Dumping) {
        state.status = TruckStatus.Dumping;
      }
    } else if (state.speed > 0) {
      state.status = TruckStatus.Hauling;
    } else {
      state.status = TruckStatus.Idle;
    }
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