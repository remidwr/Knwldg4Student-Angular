import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentService } from 'src/app/services/student.service';
import { StudentDataSource, StudentItem } from './student-datasource';
import { Student } from './student.model';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Student>;
  dataSource: StudentDataSource;

  public students: Student[] = [];
  public subscription: Subscription = new Subscription();

  public displayedColumns = ['id', 'firstName', 'lastName', 'averageRating'];

  public resultsLength = 0;
  public isLoadingResults = true;
  public isRateLimitReached = false;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSource = new StudentDataSource();
  }

  ngOnInit(): void {
    this.subscription = this.studentService.studentsChanged.subscribe(
      (students: Student[]) => {
        this.isLoadingResults = false;
        this.resultsLength = students.length;
        this.table.dataSource = students;
      }
    );

    this.students = this.studentService.getStudents();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
