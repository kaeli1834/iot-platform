import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class MetricTypeService {
  private api = inject(ApiService);
  private readonly basePath = '/metric-types';

  // CRUD
  createMetricType(metricType: { typeUid: string; description?: string; unit: string }) {
    return this.api.post<any>(this.basePath, metricType);
  }

  getMetricTypes() {
    return this.api.get<any[]>(this.basePath);
  }

  getMetricTypeById(metricTypeId: number) {
    const path = `${this.basePath}/${metricTypeId}`;
    return this.api.get<any>(path);
  }

  updateMetricType(metricTypeId: number, metricType: { description?: string; unit?: string }) {
    const path = `${this.basePath}/${metricTypeId}`;
    return this.api.put<any>(path, metricType);
  }

  deleteMetricType(metricTypeId: number) {
    const path = `${this.basePath}/${metricTypeId}`;
    return this.api.post<any>(`${path}/delete`);
  }
}
