import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { StudentInput } from '../home/registers/register.model';
import { Student, StudentsVm } from '../home/student/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private API_URL = env.API_URL;
  public studentsChanged = new Subject<Student[]>();
  private students: Student[] = [];

  constructor(private http: HttpClient) {}

  public getStudents(): Student[] {
    this.getStudentsFromApi();
    return this.students;
  }

  public setStudents(students: Student[]) {
    this.students = students;

    this.studentsChanged.next(this.students);
  }

  private getStudentsFromApi() {
    this.http
      .get<StudentsVm>(`${this.API_URL}/api/v1/students`)
      .pipe(
        map((responseData) => {
          this.students = responseData.students;

          return this.students;
        })
      )
      .subscribe((students) => {
        this.setStudents(students);
      });
  }

  public createStudent(input: StudentInput): Observable<unknown> {
    return this.http.post(`${this.API_URL}/api/v1/students`, input);
  }
}
