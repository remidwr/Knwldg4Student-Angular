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
  private meetings: Meeting[] = [];

  constructor(private http: HttpClient) {}

  public getMeetings$(): Observable<Meeting[]> {
    return this.http.get<MeetingsVm>(`${this.API_URL}/api/v1/meetings`).pipe(
      map((meetingVm) => {
        this.meetings = meetingVm.meetings;

        return this.meetings;
      })
    );
  }

  public createMeeting$(input: MeetingCreationInput): Observable<unknown> {
    return this.http.post(`${this.API_URL}/api/v1/meetings`, input);
  }
}
