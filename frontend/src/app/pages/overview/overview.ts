import { Component, OnInit, OnDestroy, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { SensorService } from '../../core/services/sensor.service';
import { ReadingDto } from '../../core/types/reading.type';
import { MetricTypeDto } from '../../core/types/metric-type.type';
import { SensorDto } from '../../core/types/sensor.type';

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
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview implements OnInit, OnDestroy {
  chart = viewChild(BaseChartDirective);
  private pollingSub?: Subscription;

  private readingService = inject(ReadingService);
  private metricTypeService = inject(MetricTypeService);
  private sensorService = inject(SensorService);

  public sensors: SensorDto[] = [];
  public selectedSensorId: number = 1;

  public metricTypes: MetricTypeDto[] = [];

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };

  get selectedSensorName(): string {
    const sensor = this.sensors.find((s) => s.id === this.selectedSensorId);
    return sensor ? sensor.name : 'Sensor #1';
  }

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 13,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
      },
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
          displayFormats: {
            second: 'HH:mm:ss',
            minute: 'HH:mm',
            hour: 'HH:mm',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  ngOnInit(): void {
    this.fetchMetricTypes();
    this.fetchSensors();
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
    this.readingService.getLastReadingsForSensor(this.selectedSensorId, 50).subscribe({
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

  private fetchSensors(): void {
    this.sensorService.getSensors().subscribe({
      next: (sensors) => {
        this.sensors = sensors;
        if (sensors.length > 0 && !this.selectedSensorId) {
          this.selectedSensorId = sensors[0].id;
        }
      },
      error: (err) => console.error('Erreur sur les capteurs :', err),
    });
  }

  public onSensorChange(): void {
    this.fetchLatestReadings();
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
