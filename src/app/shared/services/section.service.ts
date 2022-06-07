import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, Subscription } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Course, Section, SectionsVm } from '../models/section.model';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  private API_URL = env.API_URL;
  public sectionsChanged$ = new Subject<Section[]>();
  public coursesChanged$ = new Subject<Course[]>();
  private _sections: Section[] = [];
  private _courses: Course[] = [];

  constructor(private _http: HttpClient) {}

  public getSections(): Section[] {
    this.getSectionsFromApi();
    return this._sections;
  }

  public getSections$(): Observable<Section[]> {
    return this._http.get<SectionsVm>(`${this.API_URL}/api/v1/sections`).pipe(
      map((responseData) => {
        let sections: Section[] = [];

        responseData.sections.forEach((section) => {
          sections.push(section);
        });

        return sections;
      })
    );
  }

  public setSections(sections: Section[]): void {
    this._sections = sections;

    this.sectionsChanged$.next(this._sections);
  }

  private getSectionsFromApi(): void {
    this._http
      .get<SectionsVm>(`${this.API_URL}/api/v1/sections`)
      .pipe(
        map((responseData) => {
          this._sections = responseData.sections;

          return this._sections;
        })
      )
      .subscribe((sections) => {
        this.setSections(sections);
      });
  }

  public getCoursesBySectionId(id: number): Course[] {
    this.getCoursesBySectionIdFromApi(id);
    return this._courses;
  }

  public setCourses(courses: Course[]): void {
    this._courses = courses;

    this.coursesChanged$.next(this._courses);
  }

  private getCoursesBySectionIdFromApi(id: number): void {
    this._http
      .get<Course[]>(`${this.API_URL}/api/v1/sections/${id}/courses`)
      .pipe(
        map((responseData) => {
          this._courses = responseData;

          return this._courses;
        })
      )
      .subscribe((courses) => {
        this.setCourses(courses);
      });
  }
}
