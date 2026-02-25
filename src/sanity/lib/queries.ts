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
    trackId,
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
    trackId,
    trackLevel,
    prerequisite->{
      _id,
      title,
      "slug": slug.current
    },
    creatorRewardXp,
    minCompletionsForReward,
    contentTxId
  }
`;
