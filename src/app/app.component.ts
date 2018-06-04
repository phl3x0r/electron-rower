import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { RowerEventMessage } from '../models/rower-event-message.interface';
import { ReplaySubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Electron Rower';
  private metrics$ = new ReplaySubject<RowerEventMessage>();

  public speed$: Observable<number>;
  public watt$: Observable<number>;
  public distance$: Observable<number>;

  constructor(private electron: ElectronService, private zone: NgZone) {}

  ngOnInit(): void {
    this.electron.ipcRenderer.on(
      'rowerEvent',
      (_event: any, message: RowerEventMessage) => {
        this.zone.run(() => this.metrics$.next(message));
        console.log(message);
      }
    );
    this.speed$ = this.metrics$.pipe(map(m => m.speed));
    this.watt$ = this.metrics$.pipe(map(m => m.watt));
    this.distance$ = this.metrics$.pipe(map(m => m.distance));
  }
}
