import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss'],
})
export class AdministrationComponent implements OnInit {
  constructor(private _studentService: StudentService) {}

  ngOnInit(): void {}
}
