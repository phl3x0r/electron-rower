import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import {
  RowerEventMessage,
  ChartConfig,
  ChartUnits
} from '@models';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as HighCharts from 'highcharts';
import { MatSlideToggleChange } from '@angular/material';
import { environment } from '@env';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() metrics: Observable<RowerEventMessage>;
  @ViewChild('speedChart') speedTarget: ElementRef;

  chartConfig: BehaviorSubject<ChartConfig>;
  speedChart: HighCharts.ChartObject;
  metricsSubscription: Subscription;

  ngOnInit(): void {
    this.chartConfig = new BehaviorSubject<ChartConfig>({
      units: ChartUnits.TT500
    });
  }

  ngAfterViewInit(): void {
    this.speedChart = HighCharts.chart(this.speedTarget.nativeElement, {
      title: { text: 'Rower Metrics' },
      plotOptions: {
        line: {
          events: {
            legendItemClick: function() {
              // improve to use the toggle functionality instead of disabling
              return false;
            }
          },
          marker: {
            enabled: false
          }
        }
      },
      yAxis: {
        reversed: true,
        title: {
          text: ChartUnits.TT500.toString()
        }
      }
    });
    this.speedChart
      .addSeries({
        name: ChartUnits.TT500,
        type: 'line'
      })
      .show();
    this.speedChart
      .addSeries({
        name: ChartUnits.Watt,
        type: 'line'
      })
      .hide();

    this.metrics
      .pipe(
        tap(x => {
          this.speedChart.series[0].addPoint([x.distance, x.timeTo500m]);
          this.speedChart.series[1].addPoint([x.distance, x.watt]);
          if (
            this.speedChart.series[0].data.length > environment.maxChartPoints
          ) {
            this.speedChart.series[0].removePoint(0);
            this.speedChart.series[1].removePoint(0);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (typeof this.metricsSubscription !== 'undefined') {
      this.metricsSubscription.unsubscribe();
    }
  }

  toggle($event: MatSlideToggleChange) {
    console.log('toggling..');
    this.speedChart.series[$event.checked ? 0 : 1].hide();
    this.speedChart.series[$event.checked ? 1 : 0].show();
    this.speedChart.yAxis[0].update({
      reversed: !$event.checked,
      title: {
        text: $event.checked ? ChartUnits.Watt : ChartUnits.TT500
      }
    });
  }
}
