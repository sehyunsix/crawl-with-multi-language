import jobExtractor from "./jobExtractor.js";
import urlExtractor from "./urlExtractor.js";
import { BaseJobPipline } from "../../shared/pipe.js";

(async () => {
  const pipeline = new BaseJobPipline();
  await pipeline.processJob(urlExtractor, jobExtractor);
})();
