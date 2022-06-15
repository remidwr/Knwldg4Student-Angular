import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { BehaviorSubject, mergeMap, Subject } from 'rxjs';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();

  public isAdmin$ = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    private _studentService: StudentService
  ) {}

  ngOnInit(): void {
    let usersRole = localStorage.getItem('usersRole');

    if (usersRole === 'rol_1G2s7qO4gRJPRTP5') {
      this.isAdmin$.next(true);
    }

    if (!usersRole) {
      this.setUsersRoleToStorage();
    }
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };

  private setUsersRoleToStorage(): void {
    this.auth.user$.subscribe({
      next: (user) => {
        console.log('getUser: ' + user);

        if (user) {
          console.log('if User');
          const userId = user.sub as string;

          this._studentService.getUsersRole$(userId).subscribe({
            next: (usersRole) => {
              console.log('getUserRole');
              if (usersRole) {
                console.log('setStorage');

                localStorage.setItem('usersRole', usersRole.id);

                if (usersRole.id === 'rol_1G2s7qO4gRJPRTP5') {
                  this.isAdmin$.next(true);
                }
              }
            },
          });
        }
      },
    });
  }

  public onLogout() {
    localStorage.removeItem('usersRole');
    this.auth.logout({ returnTo: document.location.origin });
  }
}
