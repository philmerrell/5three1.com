import { Component, OnInit } from '@angular/core';
import { CommonModule, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, IonRouterOutlet, IonSpinner, IonText, IonTitle, IonToolbar, ModalController, Platform } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { WeightService } from '../../shared/services/weight.service';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { App } from '@capacitor/app';
import { barbell, body, build, calculator, calendar, openOutline, options, phonePortrait } from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton,
    IonItemDivider,
    IonText,
    IonSpinner,
    PercentPipe,
    RouterLink
  ]
})
export class SettingsPage implements OnInit {
  plateCalcutatorPurchaseStatusSub: Subscription;
  personalRecordsPurchaseStatusSub: Subscription;

  products: any = [];
  productsSub: Subscription;

  trainingPercentage: number;
  trainingPercentageSub: Subscription
  weightUnit: { unit: 'lb' | 'kg' };
  weightUnitSub: Subscription;
  productLoadingSub: Subscription;
  productLoading = {
    plateCalculator: false,
    personalRecords: false
  };
  purchaseStatus = {
    plateCalculator: { owned: false },
    personalRecords: { owned: false }
  };

  constructor(
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private weightService: WeightService,
    // private inAppPurchaseService: InAppPurchaseService,
    // private inAppPurchaseModalService: InAppPurchaseModalService,
    private platform: Platform,
    // private ref: ChangeDetectorRef,
    private router: Router,
    // private store: InAppPurchase2
  ) {
    addIcons({barbell, calendar, body, build, calculator, options, phonePortrait, openOutline });
  }

  ngOnInit() {
    this.trainingPercentageSub = this.weightService.getTrainingPercentageObservable()
      .subscribe(tp => this.trainingPercentage = tp);
    this.weightUnitSub = this.weightService.getWeightUnitObservable()
      .subscribe(weightUnit => this.weightUnit = weightUnit);
    // this.plateCalcutatorPurchaseStatusSub = this.inAppPurchaseService.getPlateCalculatorPurchaseStatusObservable()
      // .subscribe(status => this.purchaseStatus.plateCalculator = status);
    // this.personalRecordsPurchaseStatusSub = this.inAppPurchaseService.getPersonalRecordsPurchaseStatusObservable()
      // .subscribe(status => this.purchaseStatus.personalRecords = status);
    // this.productLoadingSub = this.inAppPurchaseService.getProductLoadingObservable()
      // .subscribe(productLoading => this.productLoading = productLoading);

    this.setupListeners();

    this.loadInAppPurchases();
  }

  ngOnDestroy() {
    this.trainingPercentageSub.unsubscribe();
    this.weightUnitSub.unsubscribe();
    this.personalRecordsPurchaseStatusSub.unsubscribe();
    this.plateCalcutatorPurchaseStatusSub.unsubscribe();
    this.productLoadingSub.unsubscribe();
  }

  async rateApp() {
    // const url = `itms-apps://itunes.apple.com/app/id${environment.appId}?action=write-review`;
    // await App.openUrl({ url });
  }

  restorePurchases() {
    // this.inAppPurchaseService.setProductLoading({ plateCalculator: true, personalRecords: true });
    // this.inAppPurchaseService.restorePurchases();
  }

  private loadInAppPurchases() {
    // const isNative = this.platform.is('capacitor');
    // if (isNative) {
    //   this.store.ready(() => {
    //     const products = this.store.products;
    //     this.products = products.filter(product => product.type !== 'application');
    //   });
    // } else {
    //   // web browser debug...
    //   this.products = this.inAppPurchaseService.getMockProducts();
    // }
  }

  private setupListeners() {
    // const isNative = this.platform.is('capacitor');
    // if (isNative) {
    //   this.store.when('product')
    //     .approved((p: IAPProduct) => {
    //       if (p.type !== 'application') {
    //         return p.verify();
    //       }
    //     })
    //     .owned((p: IAPProduct) => {
    //       if (p.type !== 'application') {
    //         this.modalController.dismiss({ message: `${p.title} is now enabled.`});
    //         this.processPurchase(p);
    //       }
    //     }) 
    //     .verified((p: IAPProduct) => { 
    //       this.processPurchase(p);
    //       this.modalController.dismiss({ message: `${p.title} is now enabled.`});
    //       p.finish()
    //     });
    // }
  }

  private processPurchase(p) {
    // switch(p.id) {
    //   case PRODUCT_PLATE_CALCULATOR:
    //     this.inAppPurchaseService.setPlateCalculatorPurchaseStatus({ owned: true });
    //     this.inAppPurchaseService.setPlateCalculatorProductLoading(false);
    //     break;
    //   case PRODUCT_PERSONAL_RECORDS:
    //     this.inAppPurchaseService.setPersonalRecordsPurchaseStatus({ owned: true });
    //     this.inAppPurchaseService.setPersonalRecordsProductLoading(false);
    //     break;
    // }
    // this.ref.detectChanges();
  }

  async presentProductModal(product) {
    // if (!product.owned) {
    //   this.inAppPurchaseModalService.presentProductModal(this.routerOutlet, product);
    // }
  }

  navigateToPlateCalculator() {
    // if (this.purchaseStatus.plateCalculator.owned) {
      this.router.navigateByUrl('/tabs/settings/plate-calculator');
    // } else {
    //   const plateCalculatorProduct = this.products.find((product) => product.id === PRODUCT_PLATE_CALCULATOR);
    //   this.presentProductModal(plateCalculatorProduct);
    // }
  }



}
