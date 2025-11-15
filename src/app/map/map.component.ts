import { Component, inject } from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  private readonly mapService = inject(MapService);

}
