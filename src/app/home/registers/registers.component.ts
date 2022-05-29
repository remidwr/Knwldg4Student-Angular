import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.scss'],
})
export class RegistersComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  public registerForm: FormGroup;
  public hide = true;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private auth: AuthService
  ) {
    this.registerForm = this.fb.group({
      username: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(200),
        ],
      ],
      email: [
        null,
        [Validators.required, Validators.email, Validators.maxLength(320)],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.subscription = this.studentService
      .createStudent(this.registerForm.value)
      .subscribe(() => this.auth.loginWithRedirect());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
