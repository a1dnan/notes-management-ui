import { CustomHttpResponse } from './interfaces/custom-http-response';
import { AppState } from './interfaces/app-state';
import { Component, OnInit } from '@angular/core';
import { NoteService } from './service/note.service';
import { BehaviorSubject, Observable, Subject, catchError, map, of, startWith } from 'rxjs';
import { DataState } from './enums/datastate';
import { Level } from './enums/level';
import { NgForm } from '@angular/forms';
import { Note } from './interfaces/note';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  appState$ = new Observable<AppState<CustomHttpResponse>>;
  readonly Level = Level;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomHttpResponse>(undefined!);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private selectedNoteSubject = new Subject<Note>();
  selectedNote$ = this.selectedNoteSubject.asObservable();


  constructor(private noteService: NoteService){}

  ngOnInit(): void {

    this.appState$ = this.noteService.notes$.pipe(
      map(response =>{
        //saving the data in the subject
        this.dataSubject.next(response);
        return {dataState: DataState.LOADED, data: response}
      }),
      startWith( {dataState: DataState.LOADING} ),
      catchError((err: string) => {
        return of({ dataState: DataState.ERROR, error: err })
      })
    );
    
  }

  saveNote(noteForm : NgForm): void {
    this.isLoadingSubject.next(true);
    this.appState$ = this.noteService.save$(noteForm.value).pipe(
      map(response =>{
        //get the existing notes and add the new note on the top of the array
        this.dataSubject.next(
          <CustomHttpResponse>{...response,
                                notes: [response.notes![0],...this.dataSubject.value.notes!]})
          noteForm.reset( { title:'', description: '', level: this.Level.HIGH} ); // Reset the form
          document.getElementById('closeModal')?.click();
          this.isLoadingSubject.next(false);
          return {dataState: DataState.LOADED, data: this.dataSubject.value}
      }),
      //Load the existing data
      startWith( {dataState: DataState.LOADED, data: this.dataSubject.value} ),
      catchError((err: string) => {
        this.isLoadingSubject.next(false);
        return of({ dataState: DataState.ERROR, error: err })
      })
    ); 
  }

  updateNote(note : Note): void {
    this.isLoadingSubject.next(true);
    this.appState$ = this.noteService.update$(note).pipe(
      map(response =>{
        //find the index of the note that we wanna update
        //loop for all notes and access to the note id and check if is equal to note id in the response
        this.dataSubject.value.notes[this.dataSubject.value.notes.findIndex(note => 
          note.id === response.notes[0].id)] = response.notes[0];

        this.dataSubject.next(<CustomHttpResponse>{...response, notes: this.dataSubject.value.notes})
          document.getElementById('closeModal')?.click();
          this.isLoadingSubject.next(false);
          return {dataState: DataState.LOADED, data: this.dataSubject.value}
      }),
      //Load the existing data
      startWith( {dataState: DataState.LOADED, data: this.dataSubject.value} ),
      catchError((err: string) => {
        this.isLoadingSubject.next(false);
        return of({ dataState: DataState.ERROR, error: err })
      })
    ); 
  }

  selectNote(note: Note): void {
    this.selectedNoteSubject.next(note);
    document.getElementById('editNoteButton').click();
  }
  
}
