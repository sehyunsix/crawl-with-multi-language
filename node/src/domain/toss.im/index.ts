import jobExtractor from "./jobExtractor.js";
import urlExtractor from "./urlExtractor.js";
import faviconExtractor from "./faviconExtractor.js";
import { BaseJobPipline } from "../../shared/pipe.js";
(async () => {
  const pipeline = new BaseJobPipline();
  await faviconExtractor.extractAndSaveFavicon();
  await await pipeline.processJob(urlExtractor, jobExtractor);
})();
