export interface MeetingCreationInput {
  title: string;
  courseId: number;
  instructorId: number;
  startAt: string;
  endAt: string;
  description: string;
  traineeIds: number[];
}
