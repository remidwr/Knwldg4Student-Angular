export interface StudentsVm {
  students: Student[];
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  averageRating: number;
}
