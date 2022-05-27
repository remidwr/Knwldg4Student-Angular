import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Section, SectionsVm } from './section.model';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  private API_URL = env.API_URL;
  public sectionsChanged = new Subject<Section[]>();
  private sections: Section[] = [];

  constructor(private http: HttpClient) {}

  public getSections(): Section[] {
    this.getSectionsFromApi();
    return this.sections;
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
}
