import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
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
      // data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // this.animal = result;
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

  private studentSub = new Subscription();
  private filteredInstructorSub: Subscription | undefined = new Subscription();
  private filteredTraineeSub: Subscription | undefined = new Subscription();
  private sectionSub = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<MeetingsCreateDialogComponent>,
    private fb: FormBuilder,
    private studentService: StudentService,
    private sectionService: SectionService,
    private meetingService: MeetingService
  ) {
    this.createMeetingForm = this.fb.group({
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
    this.students$ = this.studentService.getStudents$();
    this.sections$ = this.sectionService.getSections$();

    this.filteredInstructorSub = this.createMeetingForm
      .get('instructorId')
      ?.valueChanges.pipe(
        startWith(''),
        switchMap((value) => this.studentService.searchStudents$(value))
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

    this.meetingService
      .createMeeting$(meeting)
      .subscribe(() => this.dialogRef.close());
  }

  public onClickCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.studentSub.unsubscribe();
    this.sectionSub.unsubscribe();
    this.filteredInstructorSub?.unsubscribe();
    this.filteredTraineeSub?.unsubscribe();
  }
}
