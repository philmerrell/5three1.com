import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Lift } from './cycle.service';
import { Preferences } from '@capacitor/preferences';

export interface PRAttempt {
  id: string;
  date: string;
  estimated1RM: {
    lb: number;
    kg: number;
  };
  name: string;
  reps: number;
  weight: {
    lb: number;
    kg: number;
  };
  record: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PersonalRecordService {
  prAttemptsSubject: BehaviorSubject<PRAttempt[]> = new BehaviorSubject([]);
  personalRecordsSubject: BehaviorSubject<PRAttempt[]> = new BehaviorSubject([]);

  constructor() { }

  async addPRAttempt(lift: Lift): Promise<PRAttempt> {
    const attempt = await this.createPRAttempt(lift);
    let prAttempts = await this.getPRAttempts();
    if (prAttempts.length === 12) {
      prAttempts.pop();
    }
    prAttempts.unshift(attempt);
    this.prAttemptsSubject.next(prAttempts);
    Preferences.set({ key: 'prAttempts', value: JSON.stringify(prAttempts)});
    return attempt;
  }

  async getPRAttempts(): Promise<PRAttempt[]> {
    const result = await Preferences.get({ key: 'prAttempts'});
    return result.value ? JSON.parse(result.value) : [];
  }

  getPRAttemptsObservable(): Observable<PRAttempt[]> {
    return from(this.getPRAttempts()).pipe(
      switchMap((result: PRAttempt[]) => {
        const value = result;
        this.prAttemptsSubject.next(value);
        return this.prAttemptsSubject.asObservable();
      })
    )
  }

  async setPersonalRecord(attempt: PRAttempt) {
    let personalRecords = await this.getPersonalRecords();
    const index = personalRecords.findIndex(record => record.name === attempt.name)
    
    if (index === -1) {
      personalRecords.unshift(attempt);
    } else {
      personalRecords.splice(index, 1, attempt);
    }
    this.personalRecordsSubject.next(personalRecords);
    return Preferences.set({ key: 'personalRecords', value: JSON.stringify(personalRecords)});
  }

  async getPersonalRecords(): Promise<PRAttempt[]> {
    const result = await Preferences.get({ key: 'personalRecords' });
    return result.value ? JSON.parse(result.value) : [];
  }

  getPersonalRecordsObservable(): Observable<PRAttempt[]> {
    return from(this.getPersonalRecords()).pipe(
      switchMap((result: PRAttempt[]) => {
        const value = result;
        this.personalRecordsSubject.next(value);
        return this.personalRecordsSubject.asObservable();
      })
    )
  }

  private async checkPersonalRecord(attempt: PRAttempt): Promise<PRAttempt> {
    const personalRecords = await this.getPersonalRecords();
    const record = personalRecords.find(records => records.name === attempt.name);
    if (!record) {
      attempt.record = true;
      this.setPersonalRecord(attempt);
      return attempt;
    } else {
      const isRecord = attempt.estimated1RM.lb > record.estimated1RM.lb;
      attempt.record = isRecord;
      if (isRecord) {
        this.setPersonalRecord(attempt);
      }
      return attempt;
    }
  }

  private async createPRAttempt(lift: Lift): Promise<PRAttempt> {
    let estimatedLb1RM = (lift.weight.lb * lift.reps * 0.0333 + lift.weight.lb);
    estimatedLb1RM = parseFloat(estimatedLb1RM.toFixed(2));
    let estimatedKg1RM = (lift.weight.kg * lift.reps * 0.0333 + lift.weight.kg);
    estimatedKg1RM = parseFloat(estimatedKg1RM.toFixed(2));

    let attempt = {
      id: lift.id,
      name: lift.name,
      reps: lift.reps,
      weight: lift.weight,
      date: new Date().toISOString(),
      estimated1RM: {
        lb: estimatedLb1RM,
        kg: estimatedKg1RM
      }
    } as PRAttempt;
    
    attempt = await this.checkPersonalRecord(attempt);
    return attempt;
  }
}
