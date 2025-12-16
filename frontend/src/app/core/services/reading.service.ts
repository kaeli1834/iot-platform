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
    const params: Record<string, any> = { sensorId };
    if (limit) params['limit'] = limit;
    return this.api.get<any[]>(`${this.basePath}/lasts`, { params });
  }

  getRange(sensorId: number, start: Date, end: Date, metricId?: number) {
    const params: Record<string, any> = {
      sensorId,
      start: start.toISOString(),
      end: end.toISOString(),
    };
    if (metricId) params['metricId'] = metricId;
    return this.api.get<any[]>(`${this.basePath}/range`, { params });
  }
}
