import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { MapService } from './map.service';
import { MapBounds, MapInfo, Zone, ZoneType } from './models/map.models';
import { TruckComponent } from "./truck/truck.component";
import { TruckService } from './truck/truck.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-map',
  imports: [TruckComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  private readonly mapService = inject(MapService);
  private readonly truckService = inject(TruckService);

  private readonly canvasRef = viewChild.required<ElementRef>('map');
  private mapContext!: CanvasRenderingContext2D;
  public readonly mapWidth = 1000;
  public readonly mapHeight = 800;

  public readonly bounds: MapBounds = {
    maxX: this.mapWidth,
    maxY: this.mapHeight
  };

  public ngOnInit(): void {
    this.initializeCanvas();
    this.mapService.loadMap$()
    .pipe(take(1))
    .subscribe(
      (mapInfo: MapInfo) => {
        this.renderZones(mapInfo.zones);
        this.truckService.initialize(
          mapInfo.zones,
          this.bounds
        );
      }
    )
  }

  private initializeCanvas(): void {
    const canvas = this.canvasRef().nativeElement;
    this.mapContext = canvas.getContext('2d');
    canvas.width = this.mapWidth;
    canvas.height = this.mapHeight;
    this.mapContext.fillStyle = '#e9e9e9ff';
    this.mapContext.fillRect(0, 0, canvas.width, canvas.height);
  }

  private renderZones(zones: Zone[]): void {
    zones.forEach(zone => {
      const color = zone.type === ZoneType.Loading ? '#f38840ff' : '#3278b1ff';
      this.mapContext.fillStyle = color;
      this.mapContext.fillRect(
        zone.x,
        zone.y,
        zone.width,
        zone.height
      );

      this.mapContext.fillStyle = '#fff';
      this.mapContext.font = 'bold 20px Arial';
      this.mapContext.textAlign = 'center';
      this.mapContext.textBaseline = 'middle';
      this.mapContext.fillText(
        zone.type.toUpperCase(),
        zone.x + zone.width / 2,
        zone.y + zone.height / 2
      );
    });
  }
}
