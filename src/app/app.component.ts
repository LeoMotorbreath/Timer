import { Component } from '@angular/core';
import { Subject, Observable, timer, race} from 'rxjs';
import {tap, takeUntil,bufferTime,filter,buffer, takeWhile, debounce, debounceTime, first, bufferWhen, take, bufferToggle, switchMap, mergeMap } from 'rxjs/operators'
import {Time} from './models/time'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  time = Time.getInstance();
  emitter: Subject<boolean> = new Subject();
  emitterSub;
  timer: Observable<any> ;
  timerSub;
  listeningStopped: boolean = false;
  breaker: Subject<boolean> = new Subject();
  waitSubject: Subject<boolean>    = new Subject();
  waitListener = this.waitSubject.pipe(
    mergeMap(() => race(
        this.waitSubject.pipe(take(1)), 
        timer(300).pipe(take(1))
      )
    ),
    filter(Boolean),
    tap(()=>this.wait()),
  ).subscribe()
  waitEmit(){
    this.waitSubject.next(true);
  }
  private emitTick() { 
    this.emitter.next(true);
  }
  private wait() {
    this.breaker.next(true);
    this.listeningStopped = true;
  }
  clear(){
    this.time.clear();
    this.wait();
  }
  reset(){
    this.clear();
    this.setTimmerSub();
  }
  private startTimer() {
    this.listeningStopped = false;
    this.timer =  timer(0,10);
    return this.timer.pipe(
      takeUntil(this.breaker),
      tap(()=>this.emitTick()),
    ).subscribe()
  }
  setTimmerSub() {
    this.timerSub = this.startTimer()
  }
  ngOnInit() {
    this.emitterSub = this.emitter.pipe(
      tap(()=>this.time.proccesEmit()),
    ).subscribe();
      this.setTimmerSub();
  }
}
