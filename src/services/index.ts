import { ICourseService } from './interfaces/course.service';
import { ILearningProgressService } from './interfaces/learning-progress.service';
import { SanityCourseService } from './providers/sanity/sanity-course.service';
import { LocalProgressService } from './providers/local/local-progress.service';
import { OnChainProgressService } from './providers/onchain/onchain-progress.service';

const USE_ONCHAIN_DATA = process.env.NEXT_PUBLIC_USE_ONCHAIN === 'true';

// Courses are fetched from Sanity CMS
export const courseService: ICourseService = new SanityCourseService();

// Progress uses the Factory pattern. Swap seamlessly between On-Chain or Local Mock Data.
export const progressService: ILearningProgressService = USE_ONCHAIN_DATA 
  ? new OnChainProgressService()
  : new LocalProgressService();
