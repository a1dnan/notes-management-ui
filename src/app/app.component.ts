import { CustomHttpResponse } from './interfaces/custom-http-response';
import { AppState } from './interfaces/app-state';
import { Component, OnInit } from '@angular/core';
import { NoteService } from './service/note.service';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { DataState } from './enums/datastate';
import { Level } from './enums/level';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  appState$ = new Observable<AppState<CustomHttpResponse>>;
  readonly Level = Level;
  readonly DataState = DataState;



  constructor(private noteService: NoteService){}

  ngOnInit(): void {

    this.appState$ = this.noteService.notes$.pipe(
      map(response =>{
        return {dataState: DataState.LOADED, data: response}
      }),
      startWith( {dataState: DataState.LOADING} ),
      catchError((err: string) => {
        return of({ dataState: DataState.ERROR, error: err })
      })
    );
    
  }

  
  
}
