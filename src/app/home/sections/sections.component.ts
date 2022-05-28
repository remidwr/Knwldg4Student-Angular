import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SectionService } from 'src/app/home/sections/section.service';
import { Course, Section } from './section.model';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss'],
})
export class SectionsComponent implements OnInit, OnDestroy {
  @ViewChild('outerSort', { static: true }) sort!: MatSort;
  @ViewChild('innerSort') innerSort!: QueryList<MatSort>;
  @ViewChild('innerTables') innerTables!: QueryList<MatTable<Course>>;

  public sectionDataSource!: MatTableDataSource<Section>;
  public courseDataSource!: MatTableDataSource<Course>;
  public sectionsData: Section[] = [];
  public coursesData: Course[] = [];
  public sectionSubscription: Subscription = new Subscription();
  public courseSubscription: Subscription = new Subscription();

  public columnsToDisplay = ['id', 'title'];
  public innerDisplayedColumns = ['id', 'label'];

  public sectionsLength = 0;
  public coursesLength = 0;
  public isLoadingSections = true;
  public isLoadingCourses = true;
  public isRateLimitReached = false;
  public expandedElement!: Section | null;
  public expanded: boolean = false;

  constructor(
    private sectionService: SectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.sectionSubscription = this.sectionService.sectionsChanged.subscribe(
      (sections: Section[]) => {
        this.isLoadingSections = false;
        this.sectionsData = sections;
        this.sectionsLength = sections.length;
        this.sectionDataSource = new MatTableDataSource(sections);
        this.sectionDataSource.sort = this.sort;
      }
    );

    this.sectionsData = this.sectionService.getSections();
  }

  toggleRow(row: Section) {
    if (this.expanded === false) {
      this.courseSubscription = this.sectionService.coursesChanged.subscribe(
        (courses: Course[]) => {
          if (courses.length) {
            this.expanded = true;
          }

          let coursesData = this.sectionsData
            .filter((section) => section.id === row.id)
            .map((section) => section.courses)
            .shift();

          this.coursesData = coursesData as Course[];
          this.courseDataSource = new MatTableDataSource(coursesData);

          this.courseSubscription.unsubscribe();
        }
      );

      this.coursesData = this.sectionService.getCoursesBySectionId(row.id);
    } else {
      this.expanded = false;
    }
  }

  ngOnDestroy(): void {
    this.sectionSubscription.unsubscribe();
    this.courseSubscription.unsubscribe();
  }
}
