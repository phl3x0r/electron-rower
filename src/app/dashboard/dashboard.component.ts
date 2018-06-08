import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { RowerEventMessage, ChartConfig, ChartUnits } from '@models';
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
      chart: {
        backgroundColor: 'rgba(0,0,0,0)'
      },
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
        },

        areaspline: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, HighCharts.getOptions().colors[2]],
              [
                1,
                (HighCharts.Color(
                  HighCharts.getOptions().colors[2]
                ) as HighCharts.Gradient)
                  .setOpacity(0)
                  .get('rgba')
              ]
            ]
          },
          marker: {
            radius: 2,
            fillColor: 'green'
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          }
        }
      },
      yAxis: {
        min: 0,
        reversed: false,
        title: {
          text: ChartUnits.TT500.toString()
        }
      }
    });
    this.speedChart
      .addSeries({
        name: ChartUnits.TT500,
        type: 'areaspline'
      })
      .show();
    this.speedChart
      .addSeries({
        name: ChartUnits.Watt,
        type: 'areaspline'
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
      title: {
        text: $event.checked ? ChartUnits.Watt : ChartUnits.TT500
      }
    });
  }
}
