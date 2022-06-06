export interface MeetingsVm {
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

export interface MeetingCreationInput {
  title: string;
  courseId: number;
  instructorId: number;
  startAt: string;
  endAt: string;
  description: string;
}

export class MeetingCreationInput {
  constructor(
    public title: string,
    public courseId: number,
    public instructorId: number,
    public startAt: string,
    public endAt: string,
    public description: string
  ) {}
}
