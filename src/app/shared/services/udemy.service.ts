import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UdemyCourseList } from 'src/app/home/udemy-videos/udemy-video.model';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UdemyService {
  private API_URL = env.API_URL;
  public udemyVideosChanged$ = new Subject<UdemyCourseList>();

  constructor(private _http: HttpClient) {}

  public getUdemyVideos$(
    search: string,
    ordering: string,
    pageNumber: number,
    pageSize: number
  ): Observable<UdemyCourseList> {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('search', search);
    params = params.append('ordering', ordering);

    return this._http.get<UdemyCourseList>(`${this.API_URL}/api/v1/udemys`, {
      params: params,
    });
  }
}
