import { MapBounds, TruckState, TruckStatus, Zone, ZoneType } from '../models/map.models';
import { TruckService } from './truck.service';
import { TestBed } from '@angular/core/testing';

describe('TruckService', () => {
  let service: TruckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TruckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('clamp', () => {
    it('should return value when it is within valid range', () => {
      const result = service['clamp'](500, 1000);
      expect(result).toBe(500);
    });

    it('should return 0 when value is negative', () => {
      const result = service['clamp'](-50, 1000);
      expect(result).toBe(0);
    });

    it('should return max when value is greater than max', () => {
      const result = service['clamp'](1500, 1000);
      expect(result).toBe(1000);
    });

    it('should return 0 when value is 0', () => {
      const result = service['clamp'](0, 1000);
      expect(result).toBe(0);
    });

    it('should return max when value equals max', () => {
      const result = service['clamp'](1000, 1000);
      expect(result).toBe(1000);
    });
  });

  describe('hasReachedTarget', () => {
    it('should return true when distance is less than threshold', () => {
      const result = service['hasReachedTarget'](29.99, 30);
      expect(result).toBe(true);
    });

    it('should return false when distance equals threshold', () => {
      const result = service['hasReachedTarget'](30, 30);
      expect(result).toBe(false);
    });

    it('should return false when distance is greater than threshold', () => {
      const result = service['hasReachedTarget'](30.1, 30);
      expect(result).toBe(false);
    });

    it('should return true when distance is 0', () => {
      const result = service['hasReachedTarget'](0, 30);
      expect(result).toBe(true);
    });
  });

  describe('updateStatus', () => {
    const mockZones: Zone[] = [
      { id: '1', name: 'Loading Zone', type: ZoneType.Loading, x: 0, y: 0, width: 100, height: 100 },
      { id: '2', name: 'Dumping Zone', type: ZoneType.Dumping, x: 200, y: 200, width: 100, height: 100 }
    ];
    const mockBounds: MapBounds = { maxX: 1000, maxY: 800 };

    beforeEach(() => {
      spyOn(service, 'initialize').and.callFake((zones: Zone[], bounds: MapBounds) => {
        service["zones"] = zones;
        service["bounds"] = bounds;
      });
      
      service.initialize(mockZones, mockBounds);
    });

    it('should set status to Loading when inside a loading zone', () => {
      const state: TruckState = { id: 'T-100', speed: 0, position: { x: 50, y: 50 }, status: TruckStatus.Idle };
      expect(service['updateStatus'](state).status).toBe(TruckStatus.Loading);
    });

    it('should set status to Dumping when inside a dumping zone', () => {
      const state: TruckState = { id: 'T-100', speed: 0, position: { x: 250, y: 250 }, status: TruckStatus.Idle };
      expect(service['updateStatus'](state).status).toBe(TruckStatus.Dumping);
    });

    it('should set status to Hauling when outside Loading and Dumping zones and moving', () => {
      const state: TruckState = { id: 'T-100', speed: 50, position: { x: 150, y: 150 }, status: TruckStatus.Idle };
      expect(service['updateStatus'](state).status).toBe(TruckStatus.Hauling);
    });

    it('should set status to Idle when outside Loading and Dumping zones and not moving', () => {
      const state: TruckState = { id: 'T-100', speed: 0, position: { x: 150, y: 150 }, status: TruckStatus.Hauling };
      expect(service['updateStatus'](state).status).toBe(TruckStatus.Idle);
    });

    it('should remain Idle if starting from Idle and not moving outside a zone', () => {
      const state: TruckState = { id: 'T-100', speed: 0, position: { x: 500, y: 500 }, status: TruckStatus.Idle };
      expect(service['updateStatus'](state).status).toBe(TruckStatus.Idle);
    });
  });

  describe('isInZone', () => {
    const mockZone: Zone = {
      id: '1',
      name: 'Test Zone',
      type: ZoneType.Loading,
      x: 100,
      y: 100,
      width: 200,
      height: 200,
    };

    it('should return true when truck is inside the zone', () => {
      const result = service['isInZone'](150, 150, mockZone);
      expect(result).toBe(true);
    });

    it('should return true when truck is at the top-left corner', () => {
      const result = service['isInZone'](100, 100, mockZone);
      expect(result).toBe(true);
    });

    it('should return true when truck is at the bottom-right corner', () => {
      const result = service['isInZone'](300, 300, mockZone);
      expect(result).toBe(true);
    });

    it('should return false when truck is outside the right edge', () => {
      const result = service['isInZone'](301, 150, mockZone);
      expect(result).toBe(false);
    });

    it('should return false when truck is outside the left edge', () => {
      const result = service['isInZone'](99, 150, mockZone);
      expect(result).toBe(false);
    });

    it('should return false when truck is outside the top edge', () => {
      const result = service['isInZone'](150, 99, mockZone);
      expect(result).toBe(false);
    });

    it('should return false when truck is outside the bottom edge', () => {
      const result = service['isInZone'](150, 301, mockZone);
      expect(result).toBe(false);
    });
  });
});