import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Section } from 'src/app/shared/models/section.model';
import { SectionService } from 'src/app/shared/services/section.service';
import { StudentService } from 'src/app/shared/services/student.service';
import { Student } from '../students/student.model';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss'],
})
export class MeetingsComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  public openDialog(): void {
    const dialogRef = this.dialog.open(MeetingsCreateDialogComponent, {
      width: '80vw',
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
  public students$!: Observable<Student[]>;
  public sections$!: Observable<Section[]>;

  private studentSub: Subscription = new Subscription();
  private sectionSub: Subscription = new Subscription();

  public createMeetingForm: FormGroup;

  public selectedSectionId!: number;

  constructor(
    public dialogRef: MatDialogRef<MeetingsCreateDialogComponent>,
    private fb: FormBuilder,
    private studentService: StudentService,
    private sectionService: SectionService // @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.createMeetingForm = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(50)]],
      courseId: [null, [Validators.required]],
      instructorId: [null, [Validators.required]],
      startAt: [null, [Validators.required]],
      endAt: [null, [Validators.required]],
      description: [null, [Validators.maxLength(500)]],
      //traineesId
    });
  }

  ngOnInit(): void {
    this.students$ = this.studentService.getStudents$();
    this.sections$ = this.sectionService.getSections$();
  }

  public selectedSection = new FormControl(null, [Validators.required]);

  public onSubmit() {
    console.log(this.createMeetingForm);
  }

  public onClickCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.studentSub.unsubscribe();
    this.sectionSub.unsubscribe();
  }
}
