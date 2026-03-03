import { ICourseService } from '../../interfaces/course.service';
import { Course, CourseFilterArgs } from '../../models/types';
import { SanityService } from '@/lib/services/sanity.service';

export class SanityCourseService implements ICourseService {
  async getCourses(filters?: CourseFilterArgs): Promise<Course[]> {
    const sanityCourses = await SanityService.getAllCourses(filters as any);
    // SanityService already returns something that matches Course.
    // We just typecast it to our strict model to ensure the UI only knows about our model.
    return sanityCourses as unknown as Course[];
  }

  async getCourseBySlug(slug: string): Promise<Course | null> {
    const sanityCourse = await SanityService.getCourseBySlug(slug);
    if (!sanityCourse) return null;
    return sanityCourse as unknown as Course;
  }
}
