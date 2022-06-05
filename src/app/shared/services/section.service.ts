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
  public sectionsChanged = new Subject<Section[]>();
  public coursesChanged = new Subject<Course[]>();
  private sections: Section[] = [];
  private courses: Course[] = [];

  constructor(private http: HttpClient) {}

  public getSections(): Section[] {
    this.getSectionsFromApi();
    return this.sections;
  }

  public getSections$(): Observable<Section[]> {
    return this.http.get<SectionsVm>(`${this.API_URL}/api/v1/sections`).pipe(
      map((responseData) => {
        let sections: Section[] = [];

        responseData.sections.forEach((section) => {
          sections.push(section);
        });

        return sections;
      })
    );
  }

  public setSections(sections: Section[]) {
    this.sections = sections;

    this.sectionsChanged.next(this.sections);
  }

  private getSectionsFromApi() {
    this.http
      .get<SectionsVm>(`${this.API_URL}/api/v1/sections`)
      .pipe(
        map((responseData) => {
          this.sections = responseData.sections;

          return this.sections;
        })
      )
      .subscribe((sections) => {
        this.setSections(sections);
      });
  }

  public getCoursesBySectionId(id: number): Course[] {
    this.getCoursesBySectionIdFromApi(id);
    return this.courses;
  }

  public setCourses(courses: Course[]) {
    this.courses = courses;

    this.coursesChanged.next(this.courses);
  }

  private getCoursesBySectionIdFromApi(id: number) {
    this.http
      .get<Course[]>(`${this.API_URL}/api/v1/sections/${id}/courses`)
      .pipe(
        map((responseData) => {
          this.courses = responseData;

          return this.courses;
        })
      )
      .subscribe((courses) => {
        this.setCourses(courses);
      });
  }
}
