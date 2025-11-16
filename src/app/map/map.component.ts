import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { MapService, Zone } from './map.service';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  private readonly mapService = inject(MapService);

  private readonly canvasRef = viewChild.required<ElementRef>('map');
  private mapContext!: CanvasRenderingContext2D;

  public ngOnInit(): void {
    this.initializeCanvas();
    this.loadMapData();
  }

  private initializeCanvas(): void {
    const canvas = this.canvasRef().nativeElement;
    this.mapContext = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 800;
    this.mapContext.fillStyle = '#e9e9e9ff';
    this.mapContext.fillRect(0, 0, canvas.width, canvas.height);
  }

  private loadMapData(): void {
    this.mapService.loadMap$().subscribe({
      next: (mapInfo) => {
        this.renderZones(mapInfo.zones);
      },
    });
  }

  private renderZones(zones: Zone[]): void {
    zones.forEach(zone => {
      this.mapContext.fillStyle = zone.color;
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
