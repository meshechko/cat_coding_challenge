import { TruckService } from './truck.service';
import { TestBed } from '@angular/core/testing';

fdescribe('TruckService', () => {
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
});