import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { AdministrationComponent } from './home/administration/administration.component';
import { HomeComponent } from './home/home.component';
import { MeetingsComponent } from './home/meetings/meetings.component';
import { ProfilesComponent } from './home/profiles/profiles.component';
import { RegistersComponent } from './home/registers/registers.component';
import { StudentsComponent } from './home/students/students.component';
import { UdemyVideosComponent } from './home/udemy-videos/udemy-videos.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegistersComponent },
  { path: 'students', component: StudentsComponent },
  {
    path: 'administration',
    component: AdministrationComponent,
    canActivate: [AuthGuard],
  },
  { path: 'profile', component: ProfilesComponent, canActivate: [AuthGuard] },
  { path: 'meetings', component: MeetingsComponent, canActivate: [AuthGuard] },
  {
    path: 'online-training',
    component: UdemyVideosComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
