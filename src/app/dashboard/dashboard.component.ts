import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { RowerEventMessage } from '../../models/rower-event-message.interface';
import { Observable, Subscription } from 'rxjs';

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
        { title: 'Speed', cols: 2, rows: 1, data: m.timeTo500m },
        { title: 'Watt', cols: 1, rows: 1, data: m.watt },
        { title: 'Distance', cols: 1, rows: 2, data: m.distance },
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
