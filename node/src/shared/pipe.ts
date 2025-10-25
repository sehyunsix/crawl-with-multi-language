import type { Job, JobUrlExtractor, JobExtractor } from "./type.js";
import saveJobsToDatabase from "./saveJob.js";
import cliProgress from "cli-progress";

const bar = new cliProgress.SingleBar(
  {
    format: "progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
  },
  cliProgress.Presets.shades_classic,
);

export class BaseJobPipline {
  async processJob(urlExtractor: JobUrlExtractor, jobExtractor: JobExtractor): Promise<void> {
    let urls = await urlExtractor.extractJobUrls();
    const jobDetails: Job[] = [];
    if (!urls || urls.length === 0) {
      console.log(`No job URLs extracted from ${urlExtractor.getDomain()}`);
      return;
    }
    bar.start(urls.length, 0);
    for (const url of urls || []) {
      bar.increment();
      const jobs = await jobExtractor.extractJobDetail(url);
      if (jobs && jobs.length > 0) {
        console.log(url);
        console.log(` Extracted job details from ${jobs[0]?.title}`);
        jobDetails.push(...jobs);
      }
    }
    bar.stop();

    if (jobDetails.length > 0) {
      await saveJobsToDatabase(jobDetails);
    }
  }
}
