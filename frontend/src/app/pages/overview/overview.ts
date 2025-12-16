import { Component, OnInit, OnDestroy, viewChild, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, Chart } from 'chart.js';
import * as zoomPlugin from 'chartjs-plugin-zoom';
import { interval, Subscription } from 'rxjs';
import { ReadingService } from '../../core/services/reading.service';
import { MetricTypeService } from '../../core/services/metric-type.service';
import { ReadingDto } from '../../core/types/reading.type';
import { MetricTypeDto } from '../../core/types/metric-type.type';

@Component({
  selector: 'app-overview',
  imports: [BaseChartDirective],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview implements OnInit, OnDestroy {
  chart = viewChild(BaseChartDirective);
  private pollingSub?: Subscription;

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: false,
    plugins: {
      legend: { display: true },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          tooltipFormat: 'HH:mm:ss',
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  private readingService = inject(ReadingService);
  private metricTypeService = inject(MetricTypeService);

  metricTypes: MetricTypeDto[] = [];

  ngOnInit() {
    this.fetchMetricTypes();
    this.startPolling();
  }

  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }

  private startPolling(): void {
    this.pollingSub = interval(5000).subscribe(() => {
      this.fetchLatestReadings();
    });
    this.fetchLatestReadings();
  }

  private fetchLatestReadings(): void {
    const sensorId = 1; // Example sensor ID
    this.readingService.getLastReadingsForSensor(sensorId, 50).subscribe({
      next: (readings: ReadingDto[]) => {
        this.updateChart(readings);
      },
      error: (err) => {
        console.error('Erreur sur les readings :', err);
      },
    });
  }

  private fetchMetricTypes(): void {
    this.metricTypeService.getMetricTypes().subscribe({
      next: (metricTypes: MetricTypeDto[]) => {
        this.metricTypes = metricTypes;
      },
      error: (err) => {
        console.error('Erreur sur les types de métriques :', err);
      },
    });
  }

  private updateChart(readings: ReadingDto[]) {
    // Regrouper par metricTypeUid et timestamp
    const groupedByMetric: Record<string, Record<number, number>> = {};

    for (const r of readings) {
      const time = new Date(r.timestamp).getTime();

      if (!groupedByMetric[r.metricTypeUid]) {
        groupedByMetric[r.metricTypeUid] = {};
      }

      groupedByMetric[r.metricTypeUid][time] = r.value;
    }

    // Réinitialiser les datasets
    this.lineChartData.datasets = [];

    // Couleurs pour différentes métriques
    const colors: Record<string, string> = {
      temperature: '#ff6384',
      humidity: '#36a2eb',
      pressure: '#ffce56',
      light: '#4bc0c0',
      co2: '#9966ff',
    };

    // Créer un dataset par métrique
    Object.entries(groupedByMetric).forEach(([metricUid, values]) => {
      const dataPoints = Object.entries(values).map(([time, value]) => ({
        x: parseInt(time),
        y: value,
      }));

      // Trier par timestamp
      dataPoints.sort((a, b) => a.x - b.x);

      this.lineChartData.datasets.push({
        label: metricUid.charAt(0).toUpperCase() + metricUid.slice(1),
        data: dataPoints,
        borderColor: colors[metricUid] || '#999999',
        backgroundColor: `${colors[metricUid]}20` || '#99999920',
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      });
    });

    this.chart()?.update();
  }
}
