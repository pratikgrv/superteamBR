
import { client } from "@/lib/sanity/client";
import { 
  ALL_COURSES_QUERY, 
  COURSE_BY_SLUG_QUERY, 
  ALL_TRACKS_QUERY, 
  TRACK_BY_SLUG_QUERY, 
  ALL_INSTRUCTORS_QUERY, 
  ALL_ACHIEVEMENTS_QUERY,
  CATEGORIES_QUERY
} from "@/lib/sanity/queries";
export interface Instructor {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface TestCase {
  id: string;
  description: string;
  requiredPattern?: string; // Regex to check if code passes
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  videoUrl?: string;
  xpReward: number;
  initialCode?: string;
  content?: string;
  testCases?: TestCase[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}
export type CourseDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  difficulty: CourseDifficulty;
  topics: string[];
  instructor: Instructor;
  modules: Module[];
  reviews: Review[];
  totalDurationMinutes: number;
  totalXp: number;
  category?: string;
}

/**
 * Filter arguments for fetching courses
 */
export interface CourseFilterArgs {
  search?: string; // name
  slug?: string;
  difficulty?: (string | number)[];
  topic?: string[];
  trackId?: string;
  category?: string[];
  duration?: string[]; // "< 2h", "2h - 5h", "> 5h"
}

/**
 * Interface representing a Learning Track as returned by Sanity
 */
export interface SanityTrack {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  collectionAddress?: string;
  courses: Array<{
    id: string;
    title: string;
    slug: string;
    thumbnailUrl?: string;
    description?: string;
    difficulty?: number;
    xpPerLesson?: number;
    totalModules?: number;
    totalXp?: number;
  }>;
}

/**
 * Interface representing an Achievement/Badge as returned by Sanity
 */
export interface SanityAchievement {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  xpRequired: number;
  achievementType: string;
}

/**
 * Clean and structured service layer for fetching general Sanity content.
 * Follows a consistent singleton-like pattern with static methods.
 */
export class SanityService {

  /**
   * Fetches all courses with optional filtering applied.
   */
  static async getAllCourses(filters?: CourseFilterArgs): Promise<Course[]> {
    try {
      const sanityCourses = await client.fetch(ALL_COURSES_QUERY);
      
      let courses: Course[] = sanityCourses.map((c: any) => this.mapCourse(c));

      if (!filters) return courses;

      // Filter by Name (Search)
      if (filters.search) {
        const s = filters.search.toLowerCase();
        courses = courses.filter(c => 
          c.title.toLowerCase().includes(s) || 
          c.description.toLowerCase().includes(s)
        );
      }

      // Filter by Slug
      if (filters.slug) {
        courses = courses.filter(c => c.slug.toLowerCase() === filters.slug!.toLowerCase());
      }

      // Filter by Difficulty
      if (filters.difficulty && filters.difficulty.length > 0) {
        courses = courses.filter((c: any) => {
          return filters.difficulty!.some(d => {
            if (typeof d === "number") return c.difficulty === d;
            const diffStr = c.difficulty === 1 ? "beginner" : 
                            c.difficulty === 2 ? "intermediate" : 
                            c.difficulty === 3 ? "advanced" : 
                            typeof c.difficulty === "string" ? c.difficulty.toLowerCase() : "";
            return diffStr === d.toLowerCase();
          });
        });
      }

      // Filter by Track ID
      if (filters.trackId) {
        courses = courses.filter((c: any) => c.trackId === filters.trackId);
      }

      // Filter by Category
      if (filters.category && filters.category.length > 0) {
        courses = courses.filter(c => c.category && filters.category!.includes(c.category));
      }

      // Filter by Topic
      if (filters.topic && filters.topic.length > 0) {
        courses = courses.filter(c => c.topics?.some(t => filters.topic!.includes(t.toLowerCase())));
      }

      // Filter by Duration
      if (filters.duration && filters.duration.length > 0) {
        courses = courses.filter(c => {
          const hours = (c.totalDurationMinutes || 0) / 60;
          return filters.duration!.some(d => {
            if (d === "< 2h") return hours < 2;
            if (d === "2h - 5h") return hours >= 2 && hours <= 5;
            if (d === "> 5h") return hours > 5;
            return false;
          });
        });
      }

      return courses;
    } catch (error) {
      console.error("SanityService.getAllCourses failed:", error);
      return [];
    }
  }

  /**
   * Fetches a single course by slug.
   */
  static async getCourseBySlug(slug: string): Promise<Course | null> {
    try {
      const course = await client.fetch(COURSE_BY_SLUG_QUERY, { slug });
      if (!course) return null;
      return this.mapCourse(course);
    } catch (error) {
      console.error(`SanityService.getCourseBySlug failed for slug ${slug}:`, error);
      return null;
    }
  }

  
  /**
   * Fetches all learning tracks from Sanity with brief course references.
   * Useful for directory or landing pages.
   */
  static async getAllTracks(): Promise<SanityTrack[]> {
    try {
      const tracks = await client.fetch(ALL_TRACKS_QUERY);
      return tracks.map((t: any) => this.mapTrack(t));
    } catch (error) {
      console.error("SanityService.getAllTracks failed:", error);
      return [];
    }
  }

  /**
   * Fetches a single track by its slug with detailed course information.
   * Useful for the track overview/detail page.
   */
  static async getTrackBySlug(slug: string): Promise<SanityTrack | null> {
    try {
      const track = await client.fetch(TRACK_BY_SLUG_QUERY, { slug });
      if (!track) return null;
      return this.mapTrack(track);
    } catch (error) {
      console.error(`SanityService.getTrackBySlug failed for slug ${slug}:`, error);
      return null;
    }
  }

  /**
   * Fetches all instructors registered in the CMS.
   */
  static async getAllInstructors(): Promise<Instructor[]> {
    try {
      const instructors = await client.fetch(ALL_INSTRUCTORS_QUERY);
      return instructors.map((i: any) => ({
        id: i._id,
        name: i.name,
        bio: i.bio,
        avatarUrl: i.avatarUrl,
        twitter: i.twitter,
        website: i.website
      }));
    } catch (error) {
      console.error("SanityService.getAllInstructors failed:", error);
      return [];
    }
  }

  /**
   * Fetches all achievements and badges available for learners.
   */
  static async getAllAchievements(): Promise<SanityAchievement[]> {
    try {
      const achievements = await client.fetch(ALL_ACHIEVEMENTS_QUERY);
      return achievements.map((a: any) => ({
        id: a._id,
        title: a.title,
        description: a.description,
        imageUrl: a.imageUrl,
        xpRequired: a.xpRequired,
        achievementType: a.achievementType
      }));
    } catch (error) {
      console.error("SanityService.getAllAchievements failed:", error);
      return [];
    }
  }

  /**
   * Fetches all unique categories from courses.
   */
  static async getUniqueCategories(): Promise<string[]> {
    try {
      const categories = await client.fetch(CATEGORIES_QUERY);
      // Ensure we only return unique categories in case the GROQ query wasn't enough or for safety
      return Array.from(new Set(categories as string[]));
    } catch (error) {
      console.error("SanityService.getUniqueCategories failed:", error);
      return [];
    }
  }

  /**
   * Private helper to consistently map track data including nested courses.
   */
  private static mapTrack(t: any): SanityTrack {
    return {
      id: t._id,
      title: t.title,
      slug: t.slug,
      description: t.description,
      imageUrl: t.imageUrl,
      collectionAddress: t.collectionAddress,
      courses: (t.courses || []).map((c: any) => ({
        id: c._id,
        title: c.title,
        slug: c.slug,
        thumbnailUrl: c.thumbnailUrl,
        description: c.description,
        difficulty: c.difficulty,
        xpPerLesson: c.xpPerLesson,
        totalModules: c.totalModules,
        totalXp: c.totalXp
      }))
    };
  }

  /**
   * Private helper to consistently map course data.
   */
  private static mapCourse(c: any): Course {
    return {
      ...c,
      id: c._id,
      thumbnailUrl: c.thumbnailUrl || "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=800",
      totalDurationMinutes: c.totalDurationMinutes || 0,
      totalXp: c.totalXp || 0,
      topics: c.topics || [],
      instructor: c.instructor || { name: "Superteam", id: "default" },
      modules: c.modules ? c.modules.map((m: any) => ({
        ...m,
        id: m._id,
        lessons: m.lessons ? m.lessons.map((l: any) => ({
          ...l,
          id: l._id
        })) : []
      })) : []
    };
  }
}
