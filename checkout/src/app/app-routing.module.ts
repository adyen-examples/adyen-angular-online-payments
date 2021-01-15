import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ResultComponent } from './components/result/result.component';
import { IndexComponent } from './components/index/index.component';
import { PreviewComponent } from './components/preview/preview.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'preview', component: PreviewComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'result/:type', component: ResultComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
