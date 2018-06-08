import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { RowerEventMessage } from '@models';
import { Readout } from '@server';
import { takeWhile } from 'rxjs/operators';

let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 });

  // load the dist folder from Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, './index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // Open the DevTools optionally:
  // win.webContents.openDevTools()

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('ready', () => {
  // const readout = new Readout();
  win.webContents.on('did-finish-load', () => {
    let distance = 0;

    // temp mock data - to be deleted
    setInterval(() => {
      const speed = getRandomInt(100);
      const watt = getRandomInt(50);
      distance = distance + speed;
      win.webContents.send('rowerEvent', <RowerEventMessage>{
        timeTo500m: speed,
        watt: watt,
        distance: distance
      });
    }, 1000);

    // send the real data stream to app
    // readout
    //   .getDataStream()
    //   .pipe(takeWhile(() => win !== null))
    //   .subscribe(data => {
    //     win.webContents.send('rowerEvent', data);
    //   });
  });
});

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
