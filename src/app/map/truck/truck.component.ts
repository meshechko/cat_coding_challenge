import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TruckService } from './truck.service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'truck',
  templateUrl: './truck.component.html',
  styleUrl: './truck.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TruckComponent {
  private truckService = inject(TruckService);
  public readonly truckState$ = this.truckService.truckState$;
}
