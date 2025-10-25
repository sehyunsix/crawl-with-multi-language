import type { JobUrlExtractor, JobUrl } from "./shared/type.js";

const jobUrlExtractors: JobUrlExtractor[] = [
  require("./url/extractor/tossurlExtractor.ts"),
  require("./url/extractor/naverurlExtractor.ts"),
  require("./url/extractor/donamuurlExtractor.ts"),
  require("./url/extractor/lineurlExtractor.ts"),
  require("./url/extractor/ktyrlExtractor.ts"),
  require("./url/extractor/skturlExtractor.ts"),
  require("./url/extractor/kakaourlExtractor.ts"),
];

(async () => {
  for (const extractor of jobUrlExtractors) {
    const jobUrls = await extractor.extractJobUrls();

    if (jobUrls && jobUrls.length > 0) {
      console.log(`Extracted ${jobUrls.length} job URLs from ${extractor.getDomain()}`);
    }
  }
  return null;
})();
