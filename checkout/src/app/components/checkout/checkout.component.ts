import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';
import AdyenCheckout from '@adyen/adyen-web';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  @ViewChild('hook', { static: true }) hook: ElementRef;
  type: string = '';
  clientKey: string = environment.adyenClientKey as string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.hook = new ElementRef('');
  }

  async initiatePayment(state: any, component: any) {
    try {
      this.apiService.initiatePayment(state.data).subscribe((res) => {
        this.handleServerResponse(res, component);
      });
    } catch (error) {
      console.error(error);
      alert('Error occurred. Look at console for details');
    }
  }

  async submitAdditionalDetails(state: any, component: any) {
    try {
      this.apiService.submitAdditionalDetails(state.data).subscribe((res) => {
        this.handleServerResponse(res, component);
      });
    } catch (error) {
      console.error(error);
      alert('Error occurred. Look at console for details');
    }
  }

  handleServerResponse(res: any, component: any) {
    if (res.action) {
      component.handleAction(res.action);
    } else {
      switch (res.resultCode) {
        case 'Authorised':
          this.router.navigate(['/result/success']);
          break;
        case 'Pending':
        case 'Received':
          this.router.navigate(['/result/pending']);
          break;
        case 'Refused':
          this.router.navigate(['/result/failed']);
          break;
        default:
          this.router.navigate(['/result/error']);
          break;
      }
    }
  }

  ngOnInit(): void {
    this.type = this.route.snapshot.queryParamMap.get('type') || '';

    this.apiService.getPaymentMethods().subscribe(
      (res) => {
        const configuration = {
          paymentMethodsResponse: res,
          clientKey: this.clientKey,
          locale: 'en_US',
          environment: 'test',
          showPayButton: true,
          paymentMethodsConfiguration: {
            ideal: {
              showImage: true,
            },
            card: {
              hasHolderName: true,
              holderNameRequired: true,
              name: 'Credit or debit card',
              amount: {
                value: 1000,
                currency: 'EUR',
              },
            },
          },
          onSubmit: (state: any, component: any) => {
            if (state.isValid) {
              this.initiatePayment(state, component);
            }
          },
          onAdditionalDetails: (state: any, component: any) => {
            this.submitAdditionalDetails(state, component);
          },
        };
        const checkout = new AdyenCheckout(configuration);

        checkout.create(this.type).mount(this.hook.nativeElement);
      },
      (error) => {
        console.log('Error is: ', error);
      }
    );
  }
}
