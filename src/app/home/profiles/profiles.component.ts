import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, Subscription } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { StudentService } from 'src/app/shared/services/student.service';
import { Rating, StudentDetailed, StudentEditionInput } from './profile.model';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent implements OnInit, OnDestroy {
  private _studentSub: Subscription = new Subscription();
  private _updateStudentSub: Subscription = new Subscription();
  private _authSub: Subscription = new Subscription();
  public detailedStudent!: StudentDetailed;
  private _userId!: string;
  public profileForm: FormGroup;
  public error: any = null;

  public selectedDate!: Date | null;
  public ratings$!: Observable<Rating[]>;

  public loading$ = this._loader.loading$;

  public emailFormControl = new FormControl({ value: null, disabled: true });

  constructor(
    private _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public auth: AuthService,
    private _studentService: StudentService,
    private _loader: LoadingService
  ) {
    this.selectedDate = new Date();

    this.profileForm = this._fb.group({
      id: [null, [Validators.required]],
      firstName: [null, [Validators.maxLength(50)]],
      lastName: [null, [Validators.maxLength(50)]],
      description: [null, [Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this._loader.show();

    this._studentService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });

    this._studentService.studentDetailedChanged$.subscribe(
      (student: StudentDetailed) => {
        this._loader.hide();
        this.detailedStudent = student;
        this.profileForm.get('firstName')?.patchValue(student.firstName);
        this.profileForm.get('lastName')?.patchValue(student.lastName);
        this.profileForm.get('description')?.patchValue(student.description);
      }
    );

    this._authSub = this.auth.getUser().subscribe((user) => {
      this._loader.hide();
      this._userId = user?.sub as string;

      console.log(this._userId);
      this.detailedStudent = this._studentService.getDetailedStudent(
        this._userId
      );

      this.ratings$ = this._studentService.getStudentRatings$(this._userId);

      this.emailFormControl.setValue(user?.email);
    });
  }

  public onSubmit(): void {
    this._loader.show();

    let id = this.detailedStudent.id;
    let studentInput = new StudentEditionInput(
      this.detailedStudent.id,
      this.profileForm.get('firstName')?.value,
      this.profileForm.get('lastName')?.value,
      this.profileForm.get('description')?.value
    );

    this._updateStudentSub = this._studentService
      .updateStudentProfile$(id, studentInput)
      .subscribe(() => {
        this._loader.hide();

        this._snackBar.open('Votre profile a été mis à jour avec succès', '', {
          duration: 3000,
          panelClass: ['primary-color-snackbar'],
          horizontalPosition: 'end',
        });
      });
  }

  ngOnDestroy(): void {
    this._studentSub.unsubscribe();
    this._updateStudentSub.unsubscribe();
    this._authSub.unsubscribe();
  }
}
