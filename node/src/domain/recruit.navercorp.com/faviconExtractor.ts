import fs from "fs/promises";
import { FaviconExtractor } from "../../shared/extractor.js";

const faviconExtractor = new FaviconExtractor(
  "https://recruit.navercorp.com/share/tmplat/naver/img/og/naver_favicon_24.ico",
);
export default faviconExtractor;
