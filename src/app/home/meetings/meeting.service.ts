import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Meeting, MeetingCreationInput, MeetingsVm } from './meeting.model';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private API_URL = env.API_URL;
  private _meetings: Meeting[] = [];

  constructor(private _http: HttpClient) {}

  public getMeetings$(): Observable<Meeting[]> {
    return this._http.get<MeetingsVm>(`${this.API_URL}/api/v1/meetings`).pipe(
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
