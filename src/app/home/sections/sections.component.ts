import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  map,
  merge,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { SectionService } from 'src/app/home/sections/section.service';
import { Section } from './section.model';
import { SectionDataSource, SectionItem } from './sections-datasource';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss'],
})
export class SectionsComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Section>;
  dataSource: SectionDataSource;

  public sections: Section[] = [];
  public subscription: Subscription = new Subscription();

  public displayedColumns = ['id', 'title'];

  public resultsLength = 0;
  public isLoadingResults = true;
  public isRateLimitReached = false;

  constructor(
    private sectionService: SectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSource = new SectionDataSource();
  }

  ngOnInit(): void {
    this.subscription = this.sectionService.sectionsChanged.subscribe(
      (sections: Section[]) => {
        this.isLoadingResults = false;
        this.resultsLength = sections.length;
        this.table.dataSource = sections;
      }
    );

    this.sections = this.sectionService.getSections();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
