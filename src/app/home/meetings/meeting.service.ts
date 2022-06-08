import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Meeting, MeetingCreationInput, MeetingsVm } from './meeting.model';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private API_URL = env.API_URL;
  private _meetings: Meeting[] = [];
  public meetingAdded$: Subject<boolean>;

  constructor(private _http: HttpClient) {
    this.meetingAdded$ = new Subject<boolean>();
  }

  public getMeetings$(): Observable<Meeting[]> {
    const apiUrl = `${this.API_URL}/api/v1/meetings`;

    return this._http.get<MeetingsVm>(apiUrl).pipe(
      map((meetingVm) => {
        this._meetings = meetingVm.meetings;

        return this._meetings;
      })
    );
  }

  public createMeeting$(input: MeetingCreationInput): Observable<unknown> {
    return this._http.post(`${this.API_URL}/api/v1/meetings`, input);
  }
}
