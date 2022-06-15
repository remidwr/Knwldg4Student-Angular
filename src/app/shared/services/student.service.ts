import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import {
  Rating,
  StudentDetailed,
  StudentEditionInput,
} from 'src/app/home/profiles/profile.model';
import { environment as env } from 'src/environments/environment';
import { StudentInput } from '../../home/registers/register.model';
import {
  Student,
  StudentsVm,
  UsersRole,
} from '../../home/students/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private API_URL = env.API_URL;
  public studentsChanged$ = new Subject<Student[]>();
  public studentDetailedChanged$ = new Subject<StudentDetailed>();
  private _students: Student[] = [];
  private _studentDetailed!: StudentDetailed;
  public error = new Subject<string>();

  constructor(private _http: HttpClient) {}

  public getStudents$(): Observable<Student[]> {
    return this._http.get<StudentsVm>(`${this.API_URL}/api/v1/students`).pipe(
      map((studentVm) => {
        this._students = studentVm.students;

        return this._students;
      })
    );
  }

  public searchStudents$(filter: string): Observable<Student[]> {
    return this._http.get<StudentsVm>(`${this.API_URL}/api/v1/students`).pipe(
      map((response: StudentsVm) => {
        let results = response.students.filter((student) => {
          let fullName = `${student.firstName} ${student.lastName}`;

          return fullName.includes(filter);
        });

        return results;
      })
    );
  }

  public getUsersRole$(studentId: string): Observable<UsersRole> {
    return this._http.get<UsersRole>(
      `${this.API_URL}/api/v1/students/${studentId}/role`
    );
  }

  public getDetailedStudent(id: string): StudentDetailed {
    this.getStudentByIdFromApi(id);
    return this._studentDetailed;
  }

  public getStudentRatings$(id: string): Observable<Rating[]> {
    return this._http
      .get<StudentDetailed>(`${this.API_URL}/api/v1/students/${id}`)
      .pipe(
        map((student) => {
          return student.ratings;
        })
      );
  }

  public setDetailedStudent(student: StudentDetailed): void {
    this._studentDetailed = student;

    this.studentDetailedChanged$.next(this._studentDetailed);
  }

  private getStudentByIdFromApi(id: string): void {
    this._http
      .get<StudentDetailed>(`${this.API_URL}/api/v1/students/${id}`)
      .pipe(
        map((student) => {
          this._studentDetailed = student;

          return this._studentDetailed;
        })
      )
      .subscribe({
        next: (student) => {
          this.setDetailedStudent(student);
        },
        error: (err) => {
          if (err.status === 401) {
            this.error.next('Access denied.');
          }
        },
      });
  }

  public createStudent$(input: StudentInput): Observable<unknown> {
    return this._http.post(`${this.API_URL}/api/v1/students`, input);
  }

  public updateStudentProfile$(
    studentId: number,
    studentInput: StudentEditionInput
  ): Observable<unknown> {
    return this._http.put(
      `${this.API_URL}/api/v1/students/${studentId}`,
      studentInput
    );
  }
}
