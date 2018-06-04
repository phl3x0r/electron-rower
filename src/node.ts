import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { RowerEventMessage } from './models/rower-event-message.interface';

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
    // feed some stuff to the window. This could be events from the rower
  }
});

app.on('ready', () => {
  let distance = 0;
  setInterval(() => {
    const speed = getRandomInt(100);
    const watt = getRandomInt(50);
    distance = distance + speed;
    win.webContents.send('rowerEvent', <RowerEventMessage>{
      speed: speed,
      watt: watt,
      distance: distance
    });
    console.log('from node: ', speed);
  }, 1000);
});

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
