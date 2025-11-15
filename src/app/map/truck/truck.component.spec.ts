import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckComponent } from './truck.component';

describe('TruckComponent', () => {
  let component: TruckComponent;
  let fixture: ComponentFixture<TruckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('status getter', () => {
    it('should return "loading" when truck is in loading zone and speed is 0', () => {
      component.speed = 0;
      component.currentZone = 'loading';

      expect(component.status).toBe('loading');
    });

    it('should return "loading" when truck is in loading zone and speed is > 0', () => {
      component.speed = 5;
      component.currentZone = 'loading';

      expect(component.status).toBe('loading');
    });

    it('should return "dumping" when truck is in dumping zone and speed is 0', () => {
      component.speed = 0;
      component.currentZone = 'dumping';

      expect(component.status).toBe('dumping');
    });

    it('should return "dumping" when truck is in dumping zone and speed is > 0', () => {
      component.speed = 5;
      component.currentZone = 'dumping';

      expect(component.status).toBe('dumping');
    });

    it('should return "hauling" when speed is greater than 0 and not in any zone', () => {
      component.speed = 5;
      component.currentZone = 'transit';

      expect(component.status).toBe('hauling');
    });

    it('should return "idle" when speed is 0 and not in any zone', () => {
      component.speed = 0;
      component.currentZone = 'transit';

      expect(component.status).toBe('idle');
    });
  });
});
