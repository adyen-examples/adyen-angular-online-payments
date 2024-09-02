import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { HeaderComponent } from './components/header/header.component';
import { PreviewComponent } from './components/preview/preview.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ResultComponent } from './components/result/result.component';

@NgModule({ declarations: [
        AppComponent,
        IndexComponent,
        HeaderComponent,
        PreviewComponent,
        CheckoutComponent,
        ResultComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule, AppRoutingModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
