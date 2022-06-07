import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, startWith, Subject, Subscription, switchMap } from 'rxjs';
import { Section } from 'src/app/shared/models/section.model';
import { SectionService } from 'src/app/shared/services/section.service';
import { StudentService } from 'src/app/shared/services/student.service';
import { Student } from '../students/student.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MeetingService } from './meeting.service';
import { Meeting, MeetingCreationInput } from './meeting.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss'],
})
export class MeetingsComponent implements OnInit {
  public meetings$ = new Subject<Meeting[]>();

  constructor(
    public dialog: MatDialog,
    private meetingService: MeetingService
  ) {}

  ngOnInit(): void {
    this.meetingService.getMeetings$().subscribe((meetings) => {
      this.meetings$.next(meetings);
    });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(MeetingsCreateDialogComponent, {
      width: '50vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'app-meetings-create',
  templateUrl: 'meetings-create.component.html',
})
export class MeetingsCreateDialogComponent implements OnInit, OnDestroy {
  public createMeetingForm: FormGroup;
  public selectedSectionId!: number;
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  public students$!: Observable<Student[]>;
  public filteredInstructors!: Student[];
  public trainees: Student[] = [];
  public traineeNames: string[] = [];
  public filteredTrainees: Student[] = [];
  public sections$!: Observable<Section[]>;

  private _studentSub = new Subscription();
  private _filteredInstructorSub: Subscription | undefined = new Subscription();
  private _filteredTraineeSub: Subscription | undefined = new Subscription();
  private _sectionSub = new Subscription();

  constructor(
    private _dialogRef: MatDialogRef<MeetingsCreateDialogComponent>,
    private _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _studentService: StudentService,
    private _sectionService: SectionService,
    private _meetingService: MeetingService
  ) {
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
    this.students$ = this._studentService.getStudents$();
    this.sections$ = this._sectionService.getSections$();

    this._filteredInstructorSub = this.createMeetingForm
      .get('instructorId')
      ?.valueChanges.pipe(
        startWith(''),
        switchMap((value) => this._studentService.searchStudents$(value))
      )
      .subscribe((students) => {
        this.filteredInstructors = students;
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

  public selectedSection = new FormControl(null, [Validators.required]);

  public onSubmit(): void {
    console.log(this.createMeetingForm);

    const meeting = new MeetingCreationInput(
      this.createMeetingForm.value['title'],
      this.createMeetingForm.value['courseId'],
      this.createMeetingForm.value['instructorId'],
      this.createMeetingForm.value['startAt'],
      this.createMeetingForm.value['endAt'],
      this.createMeetingForm.value['description']
    );

    this._meetingService.createMeeting$(meeting).subscribe(() => {
      this._snackBar.open('Création du meeting réussie', '', {
        duration: 3000,
        panelClass: ['primary-color-snackbar'],
        horizontalPosition: 'end',
      });
      this._dialogRef.close();
    });
  }

  public onClickCancel(): void {
    this._dialogRef.close();
  }

  ngOnDestroy(): void {
    this._studentSub.unsubscribe();
    this._sectionSub.unsubscribe();
    this._filteredInstructorSub?.unsubscribe();
    this._filteredTraineeSub?.unsubscribe();
  }
}
