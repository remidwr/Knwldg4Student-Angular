import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { HomeComponent } from './home/home.component';
import { ProfilesComponent } from './home/profiles/profiles.component';
import { RegistersComponent } from './home/registers/registers.component';
import { SectionsComponent } from './home/sections/sections.component';
import { StudentsComponent } from './home/students/students.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegistersComponent },
  { path: 'section', component: SectionsComponent },
  { path: 'student', component: StudentsComponent },
  { path: 'profile', component: ProfilesComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
