import { Injectable } from '@angular/core';
import { RowerEventMessage } from '../../models/rower-event-message.interface';
import { Observable, interval } from 'rxjs';
import { map, startWith, share } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private readonly WATT_TO_CALORIES = 860.42065;

  public getDataStream(): Observable<RowerEventMessage> {
    let distance = 0;
    let kmph = 5 + this.getRandom(10);
    console.log('initial kmph: ', kmph);
    return interval(1000).pipe(
      map(t => {
        kmph = this.slightlyChange(kmph);
        distance = distance + kmph / 3600;
        const watt = Math.round(kmph * 1000) / 100;
        return <RowerEventMessage>{
          calph: watt * this.WATT_TO_CALORIES,
          distance: distance,
          level: 4,
          spm: kmph * 5,
          timeTo500m: 1800 / kmph,
          totalTime: t,
          watt: watt
        };
      }),
      share()
    );
  }

  private getRandom(max: number): number {
    return Math.random() * Math.floor(max);
  }

  slightlyChange(kmph: number): number {
    const maxChange = 0.5;
    const change = this.getRandom(maxChange * 2) - maxChange;
    return kmph + change > 5 && kmph + change < 20
      ? kmph + change
      : kmph - change;
  }
}
