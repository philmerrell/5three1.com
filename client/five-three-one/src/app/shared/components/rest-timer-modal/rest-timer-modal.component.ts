import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { RestTimerService } from '../../services/rest-timer.service';
import { IonButton, IonButtons, IonCol, IonGrid, IonHeader, IonIcon, IonProgressBar, IonRow, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { TimeElapsedPipe } from '../../pipes/time-elapsed.pipe';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';


@Component({
  selector: 'app-rest-timer-modal',
  templateUrl: './rest-timer-modal.component.html',
  styleUrls: ['./rest-timer-modal.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonProgressBar,
    IonGrid,
    IonRow,
    IonCol,
    TimeElapsedPipe
  ]
})
export class RestTimerModalComponent implements OnInit, OnDestroy {
  timerCountdown;
  timerLength;
  timerPercent;
  timerSub: Subscription;
  timerState;

  constructor(private restTimerService: RestTimerService, private modalController: ModalController) {
    addIcons({close})
  }

  ngOnInit() {
    this.timerSub = combineLatest([this.restTimerService.getRestTimerObservable(), this.restTimerService.getRestTimerLengthObservable(), this.restTimerService.getTimerStateObservable()])
      .subscribe(([restTimerCountdown, restTimerLength, timerState]) => {
        this.timerCountdown = restTimerCountdown;
        this.timerLength = restTimerLength;
        this.timerPercent = restTimerCountdown / restTimerLength;
        this.timerState = timerState;
      });
  }

  ngOnDestroy() {
    this.timerSub.unsubscribe();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  addToRestTimerLength(amount: number) {
    this.restTimerService.addToRestTimerLength(amount);
  }

  subtractFromRestTimerLength(amount: number) {
    this.restTimerService.subtractFromRestTimerLength(amount);
  }

  toggleTimer() {
    if (this.timerState === 'finished') {
      this.restTimerService.startRestTimer();
    } else {
      this.restTimerService.toggleTimer();
    }
  }

  resetTimer() {
    this.restTimerService.resetRestTimer();
  }

}
