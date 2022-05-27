import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.scss'],
})
export class RegistersComponent implements OnInit {
  registerForm: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder) {
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
    console.log(this.registerForm);
  }
}
