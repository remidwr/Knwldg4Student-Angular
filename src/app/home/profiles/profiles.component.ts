import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '@auth0/auth0-angular';
import { concatMap, pluck, Subscription, tap } from 'rxjs';
import { StudentService } from 'src/app/shared/services/student.service';
import { StudentDetailed } from './profile.model';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent implements OnInit, OnDestroy {
  private studentSub: Subscription = new Subscription();
  private authSub: Subscription = new Subscription();
  public detailedStudent!: StudentDetailed;
  private userId!: string;
  public profileForm: FormGroup;
  public error: any = null;
  private currentUser!: User;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public auth: AuthService,
    public studentService: StudentService
  ) {
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

    this.authSub = this.auth.getUser().subscribe((user) => {
      console.log(user);
      // this.profileForm.get('id')?.patchValue(claims?.sub);
      // console.log(this.profileForm.get('id'));

      this.userId = user?.sub as string;
      console.log(this.userId);
    });

    this.studentService.studentDetailedChanged.subscribe(
      (student: StudentDetailed) => {
        this.detailedStudent = student;
      }
    );

    this.detailedStudent = this.studentService.getDetailedStudent(2);
  }

  ngOnDestroy(): void {
    this.studentSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
