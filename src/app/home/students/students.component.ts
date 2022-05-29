import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentService } from 'src/app/shared/services/student.service';
import { StudentDataSource } from './student-datasource';
import { Student } from './student.model';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Student>;
  dataSource: StudentDataSource;

  public students: Student[] = [];
  public subscription: Subscription = new Subscription();

  public displayedColumns = ['id', 'username', 'firstName', 'averageRating'];

  public resultsLength = 0;
  public isLoadingResults = false;
  public isRateLimitReached = false;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSource = new StudentDataSource();
  }

  ngOnInit(): void {
    // this.subscription = this.studentService.studentsChanged.subscribe(
    //   (students: Student[]) => {
    //     this.isLoadingResults = false;
    //     this.resultsLength = students.length;
    //     this.table.dataSource = students;
    //   }
    // );

    this.isLoadingResults = true;

    this.subscription = this.studentService.getStudents$().subscribe({
      next: (students) => {
        this.isLoadingResults = false;
        this.students = students;
        this.resultsLength = students.length;
        this.table.dataSource = this.students;
      },
      error: (err) => {},
    });

    // this.students = this.studentService.getStudents();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
