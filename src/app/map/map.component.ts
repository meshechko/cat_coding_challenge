import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { MapService } from './map.service';

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
  }

  private initializeCanvas(): void {
    const canvas = this.canvasRef().nativeElement;
    this.mapContext = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 800;
    this.mapContext.fillStyle = '#e9e9e9ff';
    this.mapContext.fillRect(0, 0, canvas.width, canvas.height);
  }
}
