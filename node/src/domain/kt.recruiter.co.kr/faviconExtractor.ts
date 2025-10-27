import fs from "fs/promises";
import { FaviconExtractor } from "../../shared/extractor.js";

const faviconExtractor = new FaviconExtractor(
  "https://www.kt.com/favicon.ico",
  "kt.recruiter.co.kr",
);
export default faviconExtractor;
