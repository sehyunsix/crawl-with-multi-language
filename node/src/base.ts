interface JobUrl {
    url: string;
    domain: string;
    createdAt: string;
}


interface Job extends JobUrl {
   id: string;
   title: string;
   text: string;
   company: string;
   jobDepartment: string;
   jobDescription: string;
   location: string | null;
   applyStartDate: string | null;
   applyEndDate: string | null;
}


type Source = string | ImageBitmap

interface JoBUrlExtractor{

    getDomain(): string;

    extractJobUrls(): Promise<JobUrl[] | null>;

}

interface JobExtractor{

    extractJobDetail( source : Source ): Promise<Job[] | null>;

}

export type { JobUrl, Job, Source, JoBUrlExtractor, JobExtractor };