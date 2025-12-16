import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SensorService {
  private api = inject(ApiService);
  private readonly basePath = '/sensors';
  // CRUD
  createSensor(sensor: { sensorUid: string; name: string; description: string }) {
    return this.api.post<any>(this.basePath, sensor);
  }

  getSensors() {
    return this.api.get<any[]>(this.basePath);
  }

  getSensorById(sensorId: number) {
    const path = `${this.basePath}/${sensorId}`;
    return this.api.get<any>(path);
  }

  updateSensor(sensorId: number, sensor: { name?: string; description?: string }) {
    const path = `${this.basePath}/${sensorId}`;
    return this.api.put<any>(path, sensor);
  }

  deleteSensor(sensorId: number) {
    const path = `${this.basePath}/${sensorId}`;
    return this.api.post<any>(`${path}/delete`);
  }
}
