import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, startWith, Subscription, switchMap } from 'rxjs';
import { Section } from 'src/app/shared/models/section.model';
import { SectionService } from 'src/app/shared/services/section.service';
import { StudentService } from 'src/app/shared/services/student.service';
import { Student } from '../students/student.model';
import { MeetingService } from './meeting.service';
import { Meeting } from './meeting.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Course } from '../profiles/profile.model';
import { MatSelectChange } from '@angular/material/select';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss'],
})
export class MeetingsComponent implements OnInit, OnDestroy {
  public meetings: Meeting[];
  private now: Date;

  public loading$ = this._loader.loading$;

  private _meetingAddedSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private meetingService: MeetingService,
    private _loader: LoadingService
  ) {
    this.meetings = [];
    this.now = new Date();
    this._meetingAddedSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.initMeetingAddedSubscription();
  }

  private initMeetingAddedSubscription(): void {
    this._loader.show();
    this._meetingAddedSubscription =
      this.meetingService.meetingAdded$.subscribe((data: boolean) => {
        if (data) {
          this.meetingService.getMeetings$().subscribe((meetings) => {
            if (meetings) {
              this._loader.hide();
              this.meetings = meetings.filter(
                (m) =>
                  m.statusName !== 'Terminé' && new Date(m.endAt) > this.now
              );
            }
          });
        }
        this._loader.hide();
      });

    this.meetingService.getMeetings$().subscribe((meetings) => {
      this._loader.hide();
      if (meetings) {
        this.meetings = meetings.filter(
          (m) => m.statusName !== 'Terminé' && new Date(m.endAt) > this.now
        );
      }
    });
  }

  public openDialog(): void {
    this._loader.show();
    const dialogRef = this.dialog.open(MeetingsCreateDialogComponent, {
      width: '50vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this._loader.hide();
      console.log('The dialog was closed');
    });
  }

  ngOnDestroy(): void {
    this._meetingAddedSubscription.unsubscribe();
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

  public loading$ = this._loader.loading$;

  constructor(
    private _dialogRef: MatDialogRef<MeetingsCreateDialogComponent>,
    private _snackBar: MatSnackBar,
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

    this.sections$.subscribe((sections) => {
      this._loader.hide();
      this.courses = sections.find(
        (s) => s.id === this.selectedSection
      )?.courses;
    });

    this._filteredInstructorSubscription = this.createMeetingForm
      .get('instructorId')
      ?.valueChanges.pipe(
        startWith(''),
        switchMap((value) => this._studentService.searchStudents$(value))
      )
      .subscribe({
        next: (students) => {
          this._loader.hide();
          this.filteredInstructors = students;
        },
        error: (err) => {
          this._snackBar.open(
            'Erreur lors de la récupération des étudiants: ' + err.error.detail,
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

  public onSelectedSection(event: MatSelectChange) {
    this._loader.show();
    this.sections$.subscribe({
      next: (sections) => {
        this._loader.hide();
        this.courses = sections.find(
          (section) => section.id === event.value
        )?.courses;
      },
      error: (err) => {
        this._snackBar.open(
          'Erreur lors de la récupération des sections: ' + err.error.detail,
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

    this._meetingService
      .createMeeting$(this.createMeetingForm.value)
      .subscribe({
        next: () => {
          this._loader.hide();
          this._meetingService.meetingAdded$.next(true);

          this._snackBar.open('Création du meeting réussie', '', {
            duration: 3000,
            panelClass: ['primary-color-snackbar'],
            horizontalPosition: 'end',
          });

          this._dialogRef.close();
        },
        error: (err) => {
          this._snackBar.open(
            'Erreur lors de la création du meeting: ' + err.error.detail,
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

  public onClickCancel(): void {
    this._dialogRef.close();
  }

  ngOnDestroy(): void {
    this._studentSub.unsubscribe();
    this._sectionSub.unsubscribe();
    this._filteredInstructorSubscription?.unsubscribe();
    this._filteredTraineeSub?.unsubscribe();
  }
}
