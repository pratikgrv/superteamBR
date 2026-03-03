import { Course, CourseFilterArgs } from '../models/types';


export interface ICourseService {
  getCourses(filters?: CourseFilterArgs): Promise<Course[]>;
  getCourseBySlug(slug: string): Promise<Course | null>;
  // We can add the track/instructor methods later as needed
}
