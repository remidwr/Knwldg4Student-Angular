export interface StudentDetailed {
  id: number;
  lastName: string;
  firstName: string;
  description: string;
  ratings: Rating[];
  courses: Course[];
  unavailableDays: UnavailableDay[];
  meetings: Meeting[];
}

export interface Meeting {
  id: number;
  title: string;
  startAt: string;
  endAt: string;
  courseName: string;
  statusName: string;
}

export interface UnavailableDay {
  id: number;
  dayOff: string;
}

export interface Course {
  id: number;
  label: string;
}

export interface Rating {
  id: number;
  stars: number;
  comment: string;
  ratedBy: string;
}

export interface StudentEditionInput {
  id: number;
  firstName: string;
  lastName: string;
  description: string;
}

export class StudentEditionInput {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public description: string
  ) {}
}
