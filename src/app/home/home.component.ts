import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { AuthService, User } from '@auth0/auth0-angular';
import { StudentService } from '../shared/services/student.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [{ title: 'En construction', cols: 1, rows: 1 }];
      }

      return [{ title: 'En construction', cols: 2, rows: 1 }];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
