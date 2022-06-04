import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { StudentDetailed } from 'src/app/home/profiles/profile.model';
import { environment as env } from 'src/environments/environment';
import { StudentInput } from '../../home/registers/register.model';
import { Student, StudentsVm } from '../../home/students/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private API_URL = env.API_URL;
  public studentsChanged = new Subject<Student[]>();
  public studentDetailedChanged = new Subject<StudentDetailed>();
  private students: Student[] = [];
  private studentDetailed!: StudentDetailed;
  public error = new Subject<string>();

  constructor(private http: HttpClient) {}
  // public getStudents(): Student[] {
  //   this.getStudentsFromApi();
  //   return this.students;
  // }

  // public setStudents(students: Student[]) {
  //   this.students = students;

  //   this.studentsChanged.next(this.students);
  // }

  public getStudents$() {
    return this.http.get<StudentsVm>(`${this.API_URL}/api/v1/students`).pipe(
      map((studentVm) => {
        this.students = studentVm.students;

        return this.students;
      })
    );
  }

  public getDetailedStudent(id: string) {
    this.getStudentByIdFromApi(id);
    return this.studentDetailed;
  }

  public setDetailedStudent(student: StudentDetailed) {
    this.studentDetailed = student;

    this.studentDetailedChanged.next(this.studentDetailed);
  }

  private getStudentByIdFromApi(id: string) {
    this.http
      .get<StudentDetailed>(`${this.API_URL}/api/v1/students/${id}`)
      .pipe(
        map((student) => {
          this.studentDetailed = student;

          return this.studentDetailed;
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

  public createStudent(input: StudentInput): Observable<unknown> {
    return this.http.post(`${this.API_URL}/api/v1/students`, input);
  }
}
