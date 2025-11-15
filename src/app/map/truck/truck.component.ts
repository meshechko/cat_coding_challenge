import { Component, Input } from '@angular/core';

@Component({
  selector: 'truck',
  templateUrl: './truck.component.html',
  styleUrl: './truck.component.css'
})
export class TruckComponent {
  @Input() id: string = '';
  @Input() speed: number = 0;
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() currentZone: string = '';

  get status(): string {
    if (this.currentZone === 'loading') {
      return 'loading';
    }
    if (this.currentZone === 'dump') {
      return 'dumping';
    }
    if (this.speed > 0) {
      return 'hauling';
    }
    return 'idle';
  }
}
