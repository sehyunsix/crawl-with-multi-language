import jobExtractor from "./jobExractor.js";
import urlExtractor from "./urlExtractor.js";
import type { Job } from "../../shared/base.js";
import saveJobsToDatabase from "../../shared/saveJob.js";

(async () => {
  let urls = await urlExtractor.extractJobUrls();
  const jobDetails: Job[] = [];
  for (const url of urls || []) {
    const jobs = await jobExtractor.extractJobDetail(url);
    if (jobs && jobs.length > 0) {
      console.log(`Extracted job details from ${jobs[0]?.title}`);
      jobDetails.push(...jobs);
    }
  }
  if (jobDetails.length > 0) {
    await saveJobsToDatabase(jobDetails);
  }
  return null;
})();
