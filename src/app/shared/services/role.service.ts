import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Role, RolesVm } from 'src/app/home/students/student.model';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private API_URL = env.API_URL;

  constructor(private _http: HttpClient) {}

  public getRoles$(): Observable<Role[]> {
    return this._http
      .get<RolesVm>(`${this.API_URL}/api/v1/roles`)
      .pipe(map((rolesVm) => rolesVm.roles));
  }
}
