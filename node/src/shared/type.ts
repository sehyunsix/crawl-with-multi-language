interface JobUrl {
  url: string;
}

type JobType = "정규직" | "인턴" | null;

type RequireExperience = "신입" | "경력" | null;

interface Job extends JobUrl {
  id: string;
  title: string;
  rawJobsText: string;
  company: string;
  requireExperience: RequireExperience;
  jobType: JobType;
  regionText: string | null;
  requirements: string | null;
  department: string | null;
  jobDescription: string | null;
  favicon: string | null;
  idealCandidate: string | null;
  preferredQualifications: string | null;
  applyStartDate: string | null;
  applyEndDate: string | null;
}

type Source = string | ImageBitmap;

interface JobUrlExtractor {
  getDomain(): string;

  extractJobUrls(): Promise<JobUrl[] | null>;
}

interface JobExtractor {
  extractJobDetail(source: JobUrl): Promise<Job[] | null>;
}

interface JobPropertyExtractor {
  getTitle(): string;
  getRawJobsText(): string;
  getCompanyName(): string;
  getJobType(): JobType;
  getRequireExperience(): RequireExperience;
  getRegionText(): string | null;
  getDepartment(): string | null;
  getJobDescription(): string | null;
  getPreferredQualifications(): string | null;
  getRequirements(): string | null;
  getApplyStartDate(): string | null;
  getApplyEndDate(): string | null;
}

export type {
  JobUrl,
  Job,
  Source,
  JobUrlExtractor,
  JobExtractor,
  JobPropertyExtractor,
  JobType,
  RequireExperience,
};
