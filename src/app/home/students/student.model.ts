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

export interface UsersRole {
  id: string;
  name: string;
}

export interface RolesVm {
  roles: Role[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
}
