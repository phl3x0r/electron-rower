import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxElectronModule } from 'ngx-electron';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [AppComponent, DashboardComponent],
  imports: [
    BrowserModule,
    NgxElectronModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
