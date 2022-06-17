import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  public isAdmin$ = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    let usersRole = localStorage.getItem('usersRole');

    if (usersRole === 'Owner' || usersRole === 'Admin') {
      this.isAdmin$.next(true);
    }
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };
}
