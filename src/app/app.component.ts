import { Component, OnInit, NgZone, Injector } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { RowerEventMessage } from '../models/rower-event-message.interface';
import { ReplaySubject, Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { MetricsService } from './services/metrics.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Electron Rower';
  private metricsSubject$ = new ReplaySubject<RowerEventMessage>();
  public metrics$ = new Observable<RowerEventMessage>();

  constructor(
    private electron: ElectronService,
    private zone: NgZone,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    if (environment.electron) {
      this.electron.ipcRenderer.on(
        'rowerEvent',
        (_event: any, message: RowerEventMessage) => {
          this.zone.run(() => this.metricsSubject$.next(message));
        }
      );
      this.metrics$ = this.metricsSubject$.asObservable().pipe(
        startWith(<RowerEventMessage>{ timeTo500m: 0, watt: 0, distance: 0 }),
        tap(metrics => console.log(metrics))
      );
    } else {
      this.metrics$ = this.injector.get(MetricsService).getDataStream();
    }
  }
}
