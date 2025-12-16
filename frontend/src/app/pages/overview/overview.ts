import { Component, OnInit, OnDestroy, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartType,
  Chart,
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { interval, Subscription } from 'rxjs';

import { ReadingService } from '../../core/services/reading.service';
import { MetricTypeService } from '../../core/services/metric-type.service';
import { ReadingDto } from '../../core/types/reading.type';
import { MetricTypeDto } from '../../core/types/metric-type.type';

Chart.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

@Component({
  selector: 'app-overview',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview implements OnInit, OnDestroy {
  chart = viewChild(BaseChartDirective);
  private pollingSub?: Subscription;

  private readingService = inject(ReadingService);
  private metricTypeService = inject(MetricTypeService);

  metricTypes: MetricTypeDto[] = [];

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

  ngOnInit(): void {
    this.fetchMetricTypes();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  private startPolling(): void {
    this.pollingSub = interval(5000).subscribe(() => {
      this.fetchLatestReadings();
    });
    this.fetchLatestReadings();
  }

  private fetchLatestReadings(): void {
    const sensorId = 1;

    this.readingService.getLastReadingsForSensor(sensorId, 50).subscribe({
      next: (readings) => this.updateChart(readings),
      error: (err) => console.error('Erreur sur les readings :', err),
    });
  }

  private fetchMetricTypes(): void {
    this.metricTypeService.getMetricTypes().subscribe({
      next: (metricTypes) => (this.metricTypes = metricTypes),
      error: (err) => console.error('Erreur sur les types de métriques :', err),
    });
  }

  private updateChart(readings: ReadingDto[]): void {
    const grouped: Record<string, { x: number; y: number }[]> = {};

    for (const r of readings) {
      const time = new Date(r.timestamp).getTime();

      if (!grouped[r.metricTypeUid]) {
        grouped[r.metricTypeUid] = [];
      }

      grouped[r.metricTypeUid].push({
        x: time,
        y: r.value,
      });
    }

    this.lineChartData.datasets = [];

    const colors: Record<string, string> = {
      temperature: '#ff6384',
      humidity: '#36a2eb',
      pressure: '#ffce56',
      light: '#4bc0c0',
      co2: '#9966ff',
    };

    Object.entries(grouped).forEach(([metricUid, points]) => {
      points.sort((a, b) => a.x - b.x);

      this.lineChartData.datasets.push({
        label: metricUid,
        data: points,
        borderColor: colors[metricUid] ?? '#999',
        backgroundColor: `${colors[metricUid] ?? '#999'}20`,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      });
    });

    // ⚠️ mise à jour CORRECTE
    this.chart()?.chart?.update();
  }
}
