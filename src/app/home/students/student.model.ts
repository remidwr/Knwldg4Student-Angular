export interface StudentsVm {
  students: Student[];
}

export interface Student {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  averageRating: number;
}
