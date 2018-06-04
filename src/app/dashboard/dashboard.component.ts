import { Component, Input, OnInit } from '@angular/core';
import { RowerEventMessage } from '../../models/rower-event-message.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() metrics: Observable<RowerEventMessage>;
  cards = [];
  ngOnInit(): void {
    this.metrics.subscribe(m => {
      this.cards = [
        { title: 'Speed', cols: 2, rows: 1, data: m.speed },
        { title: 'Watt', cols: 1, rows: 1, data: m.watt },
        { title: 'Distance', cols: 1, rows: 2, data: m.distance },
        { title: 'Card 4', cols: 1, rows: 1, data: 'other data' }
      ];
    });
  }
}
