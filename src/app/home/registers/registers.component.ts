import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { StudentService } from 'src/app/shared/services/student.service';

// export function passwordMatchValidator(): ValidatorFn {
//   return (form: FormGroup): ValidationErrors | null => {
//     if (form.get('password')?.value === form?.get('password2')?.value)
//       return null;
//     else return { passwordMismatch: true };
//   };
// }

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.scss'],
})
export class RegistersComponent implements OnInit, OnDestroy {
  private _studentSub: Subscription = new Subscription();
  public registerForm: FormGroup;
  public hide = true;

  constructor(
    private _snackBar: SnackbarService,
    private _fb: FormBuilder,
    private _studentService: StudentService,
    private _auth: AuthService
  ) {
    this.registerForm = this._fb.group(
      {
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
        password2: [null, [Validators.required]],
      }
      // { validators: [passwordMatchValidator()] }
    );
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this._studentSub = this._studentService
      .createStudent$(this.registerForm.value)
      .subscribe({
        next: () => {
          this._snackBar.openSuccess('Création du compte réussie');
          this._auth.loginWithRedirect();
        },
        error: (err) => {
          console.log(err);

          this._snackBar.openError(
            'Une erreur est survenue lors de la création du compte: ' +
              err.error.detail
          );
        },
      });
  }

  ngOnDestroy(): void {
    this._studentSub.unsubscribe();
  }
}
