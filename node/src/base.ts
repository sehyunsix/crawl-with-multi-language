interface JobUrl {
    url: string;
    domain: string;
    createdAt: string;
}


interface Job extends JobUrl {
   id: string;
   title: string;
   rawJobsText: string;
   company: string;
   requireExperience: "신입" | "경력" | null;
   jobType: "정규직" | "인턴" | null;
   regionText: string | null;
   requirements: string;
   department: string;
   jobDescription: string;
   idealCandidate: string | null;
   preferredQualifications: string | null;
   applyStartDate: string | null;
   applyEndDate: string | null;
}


type Source = string | ImageBitmap

interface JobUrlExtractor{

    getDomain(): string;

    extractJobUrls(): Promise<JobUrl[] | null>;

}

interface JobExtractor{

    extractJobDetail( source : JobUrl ): Promise<Job[] | null>;

}

export type { JobUrl, Job, Source, JobUrlExtractor, JobExtractor };