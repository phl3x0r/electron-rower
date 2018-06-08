// var sleep=require('sleep')
import { SerialPort } from 'serialport';
import { InfluxDB, FieldType } from 'influx';
import { RowerEventMessage } from '../models/rower-event-message.interface';
import { BehaviorSubject, Observable } from 'rxjs';

export class Readout {
  private readonly INFLUX_HOST = 'INSERT YOUR INFLUXDB URL HERE';
  private readonly INFLUX_DB = 'INSERT YOUR INFLUXDB NAME HERE';
  private influxClient: InfluxDB;
  // private influxWriter: any;
  private parser: any;
  private dataStream$: BehaviorSubject<RowerEventMessage> = new BehaviorSubject<
    RowerEventMessage
  >({
    totalTime: 0,
    distance: 0,
    timeTo500m: 0,
    spm: 0,
    watt: 0,
    calph: 0,
    level: 0
  });
  // TODO: port should be auto detected
  private port: SerialPort = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });

  constructor() {
    this.influxClient = new InfluxDB({
      host: this.INFLUX_HOST,
      database: this.INFLUX_DB,
      schema: [
        {
          measurement: 'rowing_data',
          fields: {
            totalTime: FieldType.INTEGER,
            distance: FieldType.INTEGER,
            timeTo500m: FieldType.INTEGER,
            spm: FieldType.INTEGER,
            watt: FieldType.INTEGER,
            calph: FieldType.INTEGER,
            level: FieldType.INTEGER
          },
          tags: ['rower']
        }
      ]
    });
    // Using Readline delimeter with custom delimeter
    this.parser = new SerialPort.parsers.Readline({ delimiter: '\r\n' });
    this.port.pipe(this.parser);
    this.port.on('open', this.handlePort);
    this.handlePort();
  }

  private handlePort(): any {
    this.port.flush();

    /* The following writes are being issued from the windows application
	 * It is quite possible that they are needed for the application to
	 * present info about the connected device
	 *
	 * port.write("C\n");
	 * console.log(port.read());
	 * port.write("T\n");
	 * console.log(port.read());
	 * port.write("V\n");
	 * console.log(port.read());
	 * port.write("L\n");
	 * console.log(port.read());
	 * port.write("H\n");
	 * console.log(port.read());
	 * port.write("R\n");
	 * console.log(port.read());
	 */

    console.log('Port is open');

    this.parser.on('data', data => {
      if (data.length === 29) {
        console.log('Data read');
        const rowerMessage: RowerEventMessage = this.parseRowerData(data);

        // expose data to app
        this.dataStream$.next(rowerMessage);

        // write to the influx client
        this.influxClient
          .writeMeasurement('rowingdata', [{ fields: rowerMessage }])
          .then(() => console.info('write point success'))
          .catch(err => console.error('write point fail', err));
      } else {
        console.warn('Invalid data input');
      }
    });
  }

  private parseRowerData(data: any) {
    const totalMinutes = parseInt(data.slice(3, 5), 10);
    const totalSeconds = parseInt(data.slice(5, 7), 10);
    const totalTime = totalMinutes * 60 + totalSeconds;
    const distance = parseInt(data.slice(7, 12), 10);
    const MinutesTo500m = parseInt(data.slice(13, 15), 10);
    const SecondsTo500m = parseInt(data.slice(15, 17), 10);
    const timeTo500m = MinutesTo500m * 60 + SecondsTo500m;
    const spm = parseInt(data.slice(17, 20), 10);
    const watt = parseInt(data.slice(20, 23), 10);
    const calph = parseInt(data.slice(23, 27), 10);
    const level = parseInt(data.slice(27, 29), 10);
    const rowerMessage: RowerEventMessage = {
      totalTime: totalTime,
      distance: distance,
      timeTo500m: timeTo500m,
      spm: spm,
      watt: watt,
      calph: calph,
      level: level
    };
    return rowerMessage;
  }

  public getDataStream(): Observable<RowerEventMessage> {
    return this.dataStream$.asObservable();
  }
}
