import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, Subscription } from 'rxjs';
import { StudentService } from 'src/app/shared/services/student.service';
import { Rating, StudentDetailed, StudentEditionInput } from './profile.model';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent implements OnInit, OnDestroy {
  private studentSub: Subscription = new Subscription();
  private updateStudentSub: Subscription = new Subscription();
  private authSub: Subscription = new Subscription();
  public detailedStudent!: StudentDetailed;
  private userId!: string;
  public profileForm: FormGroup;
  public error: any = null;

  public selectedDate!: Date | null;
  public ratings$!: Observable<Rating[]>;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    public studentService: StudentService
  ) {
    this.selectedDate = new Date();

    this.profileForm = this.fb.group({
      id: [null, [Validators.required]],
      firstName: [null, [Validators.maxLength(50)]],
      lastName: [null, [Validators.maxLength(50)]],
      description: [null, [Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.studentService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });

    this.studentService.studentDetailedChanged.subscribe(
      (student: StudentDetailed) => {
        this.detailedStudent = student;
        this.profileForm.get('firstName')?.patchValue(student.firstName);
        this.profileForm.get('lastName')?.patchValue(student.lastName);
        this.profileForm.get('description')?.patchValue(student.description);
      }
    );

    this.authSub = this.auth.getUser().subscribe((user) => {
      this.userId = user?.sub as string;

      console.log(this.userId);
      this.detailedStudent = this.studentService.getDetailedStudent(
        this.userId
      );

      this.ratings$ = this.studentService.getStudentRatings$(this.userId);
    });
  }

  public onSubmit(): void {
    let id = this.detailedStudent.id;
    let studentInput = new StudentEditionInput(
      this.detailedStudent.id,
      this.profileForm.get('firstName')?.value,
      this.profileForm.get('lastName')?.value,
      this.profileForm.get('description')?.value
    );

    this.updateStudentSub = this.studentService
      .updateStudentProfile(id, studentInput)
      .subscribe();
  }

  ngOnDestroy(): void {
    this.studentSub.unsubscribe();
    this.updateStudentSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
