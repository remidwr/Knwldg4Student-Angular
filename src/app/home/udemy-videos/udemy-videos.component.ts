import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { UdemyService } from 'src/app/shared/services/udemy.service';
import { Ordering, Result, UdemyCourseList } from './udemy-video.model';

@Component({
  selector: 'app-udemy-videos',
  templateUrl: './udemy-videos.component.html',
  styleUrls: ['./udemy-videos.component.scss'],
})
export class UdemyVideosComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<Result>;

  public loading$ = this._loader.loading$;

  public udemyCourses!: UdemyCourseList;
  public udemyCourseResults: Result[] = [];
  private udemySub = new Subscription();
  public udemyVideosChanged$ = new Subject<Result[]>();

  public dataSource!: MatTableDataSource<Result>;

  public resultsLength = 0;
  public pageIndex!: number;
  public pageSize!: number;

  public displayedColumns = ['image', 'title'];

  public filterForm: FormGroup;

  public orderings: Ordering[] = [
    { name: 'Pertinence', value: 'relevance' },
    { name: 'Les plus consultés', value: 'most-reviewed' },
    { name: 'Les mieux côtés', value: 'highest-rated' },
    { name: 'Les plus récents', value: 'newest' },
  ];

  constructor(
    private _udemyService: UdemyService,
    private _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _loader: LoadingService
  ) {
    this.filterForm = this._fb.group({
      search: [''],
      ordering: ['relevance'],
    });
  }

  ngOnInit(): void {
    this.getUdemyVideos();
  }

  public getUdemyVideos(event?: PageEvent) {
    this._loader.show();

    let pageIndex = event?.pageIndex;
    let pageSize = event?.pageSize;

    if (!pageIndex) {
      pageIndex = 1;
    }

    if (!pageSize) {
      pageSize = 10;
    }

    this.udemySub = this._udemyService
      .getUdemyVideos$('', '', pageIndex, pageSize)
      .subscribe({
        next: (udemyCourses) => {
          this._loader.hide();

          this.udemyCourses = udemyCourses;
          this.udemyCourseResults = udemyCourses.results;
          this.table.dataSource = this.udemyCourses.results;
          this.dataSource = new MatTableDataSource<Result>(
            udemyCourses.results
          );

          this.resultsLength = udemyCourses.count;
          this.pageIndex = pageIndex as number;
          this.pageSize = pageSize as number;
        },
        error: (err) => {
          console.log(err);

          this._loader.hide();

          this._snackBar.open(
            'Erreur lors du chargement des vidéos Udemy',
            '',
            {
              duration: 3000,
              panelClass: ['danger-color-snackbar'],
              horizontalPosition: 'end',
            }
          );
        },
      });
  }

  public redirectToUdemy(udemyUrl: string) {
    window.open(`https://www.udemy.com${udemyUrl}`, '_blank');
  }

  public onSubmit(): void {
    this._loader.show();

    let search = this.filterForm.get('search')?.value;
    let ordering = this.filterForm.get('ordering')?.value;

    this.udemySub = this._udemyService
      .getUdemyVideos$(search, ordering, this.pageIndex, this.pageSize)
      .subscribe({
        next: (udemyCourses) => {
          this._loader.hide();

          this.udemyCourses = udemyCourses;
          this.udemyCourseResults = udemyCourses.results;
          this.resultsLength = udemyCourses.count;
          this.table.dataSource = this.udemyCourses.results;
        },
        error: (err) => {
          console.log(err);

          this._loader.hide();

          this._snackBar.open(
            'Erreur lors du chargement des vidéos Udemy',
            '',
            {
              duration: 3000,
              panelClass: ['danger-color-snackbar'],
              horizontalPosition: 'end',
            }
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.udemySub.unsubscribe();
  }
}
