import fs from "fs/promises";
import { FaviconExtractor } from "../../shared/extractor.js";

const faviconExtractor = new FaviconExtractor(
  "https://static.toss.im/tds/favicon/favicon.ico",
  "toss.im",
);
export default faviconExtractor;
