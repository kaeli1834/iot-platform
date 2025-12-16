import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ReadingService {
  private api = inject(ApiService);
  private readonly basePath = '/readings';

  // get lasts readings for a sensor
  getLastReadingsForSensor(sensorId: number, limit?: number) {
    const path = `${this.basePath}/sensor/lasts/sensorId?${sensorId}&limit=${limit}`;
    return this.api.get<any[]>(path);
  }

  getRange(sensorId: number, start: Date, end: Date, metricId?: number) {
    const path = `${
      this.basePath
    }/sensor/range?sensorId=${sensorId}&start=${start.toISOString()}&end=${end.toISOString()}${
      metricId ? `&metricId=${metricId}` : ''
    }`;
    return this.api.get<any[]>(path);
  }
}
