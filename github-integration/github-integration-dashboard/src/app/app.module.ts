import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserInterceptor } from './integration/user.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

    AppRoutingModule
  ],
  providers: [
        { provide: HTTP_INTERCEPTORS, useClass: UserInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
