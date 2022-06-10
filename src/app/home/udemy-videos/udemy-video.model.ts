export interface UdemyCourseList {
  count: number;
  next: string;
  previous: string;
  results: Result[];
}

export interface Result {
  id: number;
  title: string;
  url: string;
  image240X135: string;
  headline: string;
}

export interface Ordering {
  name: string;
  value: string;
}
