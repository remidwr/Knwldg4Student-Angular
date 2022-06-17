import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
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

  public loading$ = this._loader.loading$;

  public students: Student[] = [];
  public studentSub: Subscription = new Subscription();

  public displayedColumns = [
    'id',
    'username',
    'firstName',
    'lastName',
    'averageRating',
  ];

  public resultsLength = 0;
  public isLoadingResults = false;
  public isRateLimitReached = false;

  public isAdmin$ = new BehaviorSubject<boolean>(false);

  constructor(
    private _studentService: StudentService,
    private _snackBar: SnackbarService,
    private _loader: LoadingService
  ) {
    this.dataSource = new StudentDataSource();
  }

  ngOnInit(): void {
    this._loader.show();

    let usersRole = localStorage.getItem('usersRole');

    if (usersRole === 'Owner' || usersRole === 'Admin') {
      this.isAdmin$.next(true);
      this.displayedColumns.splice(1, 0, 'role');
    }

    this.studentSub = this._studentService.getStudents$().subscribe({
      next: (students: Student[]) => {
        this._loader.hide();
        this.students = students;
        this.resultsLength = students.length;
        this.table.dataSource = this.students;
      },
      error: (err) => {
        console.log(err);

        this._loader.hide();

        this._snackBar.openError(
          'Erreur lors du chargement des formateurs: ' + err.error.detail
        );
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.studentSub.unsubscribe();
  }
}
