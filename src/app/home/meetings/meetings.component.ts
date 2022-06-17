import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  concatMap,
  debounceTime,
  filter,
  mergeAll,
  mergeMap,
  Observable,
  startWith,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { Section } from 'src/app/shared/models/section.model';
import { SectionService } from 'src/app/shared/services/section.service';
import { StudentService } from 'src/app/shared/services/student.service';
import { Student } from '../students/student.model';
import { MeetingService } from './meeting.service';
import { Meeting } from './meeting.model';
import { Course } from '../profiles/profile.model';
import { MatSelectChange } from '@angular/material/select';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss'],
})
export class MeetingsComponent implements OnInit, OnDestroy {
  public meetings: Meeting[];
  private now: Date;

  public loading$ = this._loader.loading$;

  private _meetingAddedSub = new Subscription();
  private _meetingSub = new Subscription();
  private _dialogSub = new Subscription();

  constructor(
    public dialog: MatDialog,
    private meetingService: MeetingService,
    private _loader: LoadingService,
    private _snackBar: SnackbarService
  ) {
    this.meetings = [];
    this.now = new Date();
  }

  ngOnInit(): void {
    this.initMeetingAddedSubscription();
  }

  private initMeetingAddedSubscription(): void {
    this._loader.show();

    this.meetingService.meetingAdded$
      .pipe(
        filter((value) => value === true),
        concatMap(() => this.meetingService.getMeetings$())
      )
      .subscribe({
        next: (meetings) => {
          this._loader.hide();

          if (meetings) {
            this.meetings = meetings.filter(
              (m) => m.statusName !== 'Terminé' && new Date(m.endAt) > this.now
            );
          }
        },
        error: (err) => {
          console.log(err);

          this._loader.hide();

          this._snackBar.openError(
            'Une erreur est survenue lors de la récupération des meetings: ' +
              err.error.detail
          );
        },
      });

    this._meetingSub = this.meetingService.getMeetings$().subscribe({
      next: (meetings) => {
        this._loader.hide();

        if (meetings) {
          this.meetings = meetings.filter(
            (m) => m.statusName !== 'Terminé' && new Date(m.endAt) > this.now
          );
        }
      },
      error: (err) => {
        console.log(err);

        this._loader.hide();

        this._snackBar.openError(
          'Une erreur est survenue lors de la récupération des meetings: ' +
            err.error.detail
        );
      },
    });
  }

  public openDialog(): void {
    this._loader.show();

    const dialogRef = this.dialog.open(MeetingsCreateDialogComponent, {
      width: '50vw',
    });

    this._dialogSub = dialogRef.afterClosed().subscribe({
      next: (result) => {
        this._loader.hide();
      },
      error: (err) => {
        console.log(err);

        this._loader.hide();

        this._snackBar.openError('Une erreur est survenue: ' + err.message);
      },
    });
  }

  ngOnDestroy(): void {
    this._meetingAddedSub.unsubscribe();
    this._meetingSub.unsubscribe();
    this._dialogSub.unsubscribe();
  }
}

@Component({
  selector: 'app-meetings-create',
  templateUrl: 'meetings-create.component.html',
})
export class MeetingsCreateDialogComponent implements OnInit, OnDestroy {
  public createMeetingForm: FormGroup;
  public selectedSection: number;
  public selectedSectionId!: number;
  public courses: Course[] | undefined;

  public students$!: Observable<Student[]>;
  public filteredInstructors!: Student[];
  public trainees: Student[] = [];
  public traineeNames: string[] = [];
  public filteredTrainees: Student[] = [];
  public sections$!: Observable<Section[]>;

  private _studentSub = new Subscription();
  private _filteredInstructorSubscription: Subscription | undefined =
    new Subscription();
  private _filteredTraineeSub: Subscription | undefined = new Subscription();
  private _sectionSub = new Subscription();
  private _mettingSub = new Subscription();

  public loading$ = this._loader.loading$;

  constructor(
    private _dialogRef: MatDialogRef<MeetingsCreateDialogComponent>,
    private _snackBar: SnackbarService,
    private _fb: FormBuilder,
    private _studentService: StudentService,
    private _sectionService: SectionService,
    private _meetingService: MeetingService,
    private _loader: LoadingService
  ) {
    this.selectedSection = 1;
    this.courses = [];

    this.createMeetingForm = this._fb.group({
      title: [null, [Validators.required, Validators.maxLength(50)]],
      courseId: [null, [Validators.required]],
      instructorId: [null, [Validators.required]],
      startAt: [null, [Validators.required]],
      endAt: [null, [Validators.required]],
      description: [null, [Validators.maxLength(500)]],
      // traineeIds: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.initCreationMeeting();
  }

  private initCreationMeeting() {
    this._loader.show();

    this.students$ = this._studentService.getStudents$();
    this.sections$ = this._sectionService.getSections$();

    this._sectionSub = this.sections$.subscribe({
      next: (sections) => {
        this._loader.hide();
        this.courses = sections.find(
          (s) => s.id === this.selectedSection
        )?.courses;
      },
      error: (err) => {
        console.log(err);

        this._loader.hide();

        this._snackBar.openError(
          'Une erreur est survenue lors de la récupération des sections: ' +
            err.error.detail
        );
      },
    });

    this._filteredInstructorSubscription = this.createMeetingForm
      .get('instructorId')
      ?.valueChanges.pipe(
        startWith(''),
        debounceTime(800),
        switchMap((value) => this._studentService.searchStudents$(value))
      )
      .subscribe({
        next: (students) => {
          this._loader.hide();

          this.filteredInstructors = students;
        },
        error: (err) => {
          this._loader.hide();

          this._snackBar.openError(
            'Erreur lors de la récupération des étudiants: ' + err.error.detail
          );
        },
      });
  }

  public onSelectedSection(event: MatSelectChange) {
    this._loader.show();
    this._sectionSub = this.sections$.subscribe({
      next: (sections) => {
        this._loader.hide();

        this.courses = sections.find(
          (section) => section.id === event.value
        )?.courses;
      },
      error: (err) => {
        this._loader.hide();

        this._snackBar.openError(
          'Erreur lors de la récupération des sections: ' + err.error.detail
        );
      },
    });
  }

  public displayInstructorFullName(studentId: number): string {
    if (this.filteredInstructors) {
      let selectedInstructor = this.filteredInstructors.find(
        (students) => students.id === studentId
      );

      return `${selectedInstructor?.firstName} ${selectedInstructor?.lastName}`;
    }

    return '';
  }

  public onSubmit(): void {
    this._loader.show();

    this._mettingSub = this._meetingService
      .createMeeting$(this.createMeetingForm.value)
      .subscribe({
        next: () => {
          this._loader.hide();

          this._meetingService.meetingAdded$.next(true);

          this._snackBar.openSuccess('Création du meeting réussie');

          this._dialogRef.close();
        },
        error: (err) => {
          this._loader.hide();

          this._snackBar.openError(
            'Erreur lors de la création du meeting: ' + err.error.detail
          );
        },
      });
  }

  public onClickCancel(): void {
    this._dialogRef.close();
  }

  ngOnDestroy(): void {
    this._mettingSub.unsubscribe();
    this._studentSub.unsubscribe();
    this._sectionSub.unsubscribe();
    this._filteredInstructorSubscription?.unsubscribe();
    this._filteredTraineeSub?.unsubscribe();
  }
}
