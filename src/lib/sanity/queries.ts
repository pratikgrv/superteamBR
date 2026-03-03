import { groq } from "next-sanity";

// Query to get all courses for the catalog grid
export const ALL_COURSES_QUERY = groq`
  *[_type == "course"]{
    _id,
    title,
    "slug": slug.current,
    description,
    "thumbnailUrl": thumbnail.asset->url,
    difficulty,
    topics,
    instructor->{
      _id,
      name,
      bio,
      "avatarUrl": avatar.asset->url
    },
    "totalModules": count(modules),
    "totalDurationMinutes": math::sum(modules[]->lessons[]->durationMinutes),
    "totalXp": (count(modules[]->lessons) * xpPerLesson),
    isActive,
    xpPerLesson,
    category,
    "trackId": track._ref,
    trackLevel
  }
`;

// Query to get a single course by its slug, including structured modules and lessons
export const COURSE_BY_SLUG_QUERY = groq`
  *[_type == "course" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    "thumbnailUrl": thumbnail.asset->url,
    difficulty,
    topics,
    instructor->{
      _id,
      name,
      bio,
      "avatarUrl": avatar.asset->url
    },
    modules[]->{
      _id,
      title,
      description,
      lessons[]->{
        _id,
        title,
        description,
        durationMinutes,
        videoUrl,
        lessonType,
        content
      }
    },
    "totalDurationMinutes": math::sum(modules[]->lessons[]->durationMinutes),
    "totalXp": (count(modules[]->lessons) * xpPerLesson),
    isActive,
    xpPerLesson,
    category,
    trackId,
    trackLevel,
    prerequisite->{
      _id,
      title,
      "slug": slug.current
    },
    contentTxId
  }
`;

// Query to get all learning tracks
export const ALL_TRACKS_QUERY = groq`
  *[_type == "track"]{
    _id,
    title,
    "slug": slug.current,
    description,
    "imageUrl": image.asset->url,
    collectionAddress,
    "courses": courses[]->{
      _id,
      title,
      "slug": slug.current,
      "thumbnailUrl": thumbnail.asset->url
    }
  }
`;

// Query to get a single track by slug with detailed courses
export const TRACK_BY_SLUG_QUERY = groq`
  *[_type == "track" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    "imageUrl": image.asset->url,
    collectionAddress,
    "courses": courses[]->{
      _id,
      title,
      "slug": slug.current,
      description,
      "thumbnailUrl": thumbnail.asset->url,
      difficulty,
      xpPerLesson,
      "totalModules": count(modules),
      "totalXp": (count(modules[]->lessons) * xpPerLesson)
    }
  }
`;

// Query to get all instructors
export const ALL_INSTRUCTORS_QUERY = groq`
  *[_type == "instructor"]{
    _id,
    name,
    bio,
    "avatarUrl": avatar.asset->url,
    twitter,
    website
  }
`;

// Query to get all achievements/badges
export const ALL_ACHIEVEMENTS_QUERY = groq`
  *[_type == "achievement"]{
    _id,
    title,
    description,
    "imageUrl": icon.asset->url,
    xpRequired,
    achievementType
  }
`;

// Query to get unique categories from all courses
export const CATEGORIES_QUERY = groq`
  array::unique(*[_type == "course" && defined(category)].category)
`;
