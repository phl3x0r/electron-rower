import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { RowerEventMessage } from '@models';
import { Observable, Subscription } from 'rxjs';
import { tt500string } from '@utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Input() metrics: Observable<RowerEventMessage>;

  cards = [];
  metricsSubscription: Subscription;

  ngOnInit(): void {
    this.metrics.subscribe(m => {
      this.cards = [
        { title: 'Speed', cols: 2, rows: 1, data: tt500string(m.timeTo500m) },
        { title: 'Watt', cols: 1, rows: 1, data: m.watt },
        {
          title: 'Distance',
          cols: 1,
          rows: 2,
          data: Math.round(m.distance * 100) / 100
        },
        { title: 'Card 4', cols: 1, rows: 1, data: 'other data' }
      ];
    });
  }

  ngOnDestroy(): void {
    if (typeof this.metricsSubscription !== 'undefined') {
      this.metricsSubscription.unsubscribe();
    }
  }
}
