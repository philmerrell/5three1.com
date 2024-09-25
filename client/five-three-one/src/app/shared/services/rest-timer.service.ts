import { Injectable } from '@angular/core';
import { timer, BehaviorSubject, Subscription, Observable, from } from 'rxjs';
import { map, switchMap, takeWhile } from 'rxjs/operators';
import { AudioService } from './audio.service';
import { HapticService } from './haptic.service';
import { Preferences } from '@capacitor/preferences';


@Injectable({
  providedIn: 'root'
})
export class RestTimerService {
  countDownFrom: number;
  currentCount: number;
  restTimerSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  restTimerSubscription: Subscription;
  restTimerLengthSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  latestCompletedLiftId: BehaviorSubject<string> = new BehaviorSubject('');
  timerLastActiveDate: Date;
  timerState: 'progressing' | 'paused' | 'stopped' | 'finished' | 'inactive' = 'stopped';
  timerStateSubject: BehaviorSubject<string> = new BehaviorSubject('stopped');


  constructor(private audioService: AudioService, private hapticService: HapticService) { }

  getRestTimerObservable() {
    return this.restTimerSubject.asObservable();
  }

  async startRestTimer(countDownFrom?: number) {
    // get rest timer settings.
    if (this.restTimerSubscription) {
      this.resetRestTimer();
    }

    this.setTimerState('progressing');
    const countDown = countDownFrom ? countDownFrom : await this.getRestTimerLength();
    this.restTimerSubscription = 
    timer(0, 1000).pipe(
      map(i => {
          this.currentCount = countDown - i;
          return this.currentCount;
        }),
        takeWhile(count => {
          if (count === 0) {
            this.playTimerSound();
            this.hapticService.vibrate();
          }
          if (count <= -1) {
            this.setTimerState('finished');
          }
          return count > -1
        }),
        takeWhile(() => this.timerState === 'progressing'))
      .subscribe((countDown: number) => {
        this.restTimerSubject.next(countDown);
    });
  }

  toggleTimer() {
    if (this.timerState === 'progressing') {
      this.setTimerState('paused');
    } else {
      this.setTimerState('progressing');
      this.startRestTimer(this.currentCount);
    }
  }

  setTimerLastActiveDate(date: Date) {
    this.timerLastActiveDate = date;
  }

  getTimerLastActiveDate() {
    return this.timerLastActiveDate;
  }

  async resetRestTimer() {
    if (this.restTimerSubscription) {
      this.setTimerState('stopped');
      this.restTimerSubscription.unsubscribe();
      this.restTimerSubscription = null;
      const timerLength = await this.getRestTimerLength();
      this.countDownFrom = timerLength;
      this.currentCount = timerLength;
      this.restTimerSubject.next(this.countDownFrom);
    }
  }

  playTimerSound() {
    this.audioService.playTimerSound();
  }

  setRestTimerLength(length: number) {
    this.restTimerLengthSubject.next(length);
    return Preferences.set({ key: 'restTimerLength', value: JSON.stringify(length)})
  }

  async addToRestTimerLength(amount: number) {
    const timer = await this.getRestTimerLength();
    const timerLength = timer + amount;
    this.setRestTimerLength(timerLength);
    this.countDownFrom = this.countDownFrom + amount;
    this.currentCount = this.currentCount + amount;
    this.restTimerSubject.next(this.currentCount);
    if (this.timerState === 'progressing') {
      this.startRestTimer(this.currentCount);
    }
  }

  async subtractFromRestTimerLength(amount: number) {
    const timer = await this.getRestTimerLength();
    if (timer - amount > 0) {
      const timerLength = timer - amount;
      if (this.currentCount - amount > 0) {
        this.setRestTimerLength(timerLength);
        this.countDownFrom = this.countDownFrom - amount;
        this.currentCount = this.currentCount - amount;
        this.restTimerSubject.next(this.currentCount);
        if (this.timerState === 'progressing') {
          this.startRestTimer(this.currentCount);
        }
      }
    }
  }

  getTimerState() {
    return this.timerState;
  }

  getCurrentCount() {
    return this.currentCount;
  }

  setCurrentCount(count: number) {
    this.currentCount = count;
  }

  async getRestTimerLength() {
    const result = await Preferences.get({ key: 'restTimerLength'});
    return result.value ? parseInt(result.value) : 180;
  }

  getRestTimerLengthObservable(): Observable<number> {
    return from(this.getRestTimerLength()).pipe(
      switchMap((result: any) => {
        this.restTimerLengthSubject.next(result);
        return this.restTimerLengthSubject.asObservable();
      })
    )
  }

  setLatestCompletedLiftId(id: string) {
    this.latestCompletedLiftId.next(id);
  }

  getLatestCompletedLiftIdObservable() {
    return this.latestCompletedLiftId.asObservable();
  }

  setTimerState(state: 'paused' | 'progressing' | 'stopped' | 'finished' | 'inactive') {
    this.timerState = state;
    this.timerStateSubject.next(state);
  }

  getTimerStateObservable() {
    return this.timerStateSubject.asObservable();
  }

  

}
