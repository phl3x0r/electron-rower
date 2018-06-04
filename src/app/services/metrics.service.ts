import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { RowerEventMessage } from '../../models/rower-event-message.interface';
import { ReplaySubject, Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root', deps: [ElectronService] })
export class MetricsService {}
