import { MatTableDataSource } from '@angular/material/table';

export interface SectionsVm {
  sections: Section[];
}

export interface Section {
  id: number;
  title: string;
  courses: Course[];
}

export interface Course {
  id: number;
  label: string;
}
