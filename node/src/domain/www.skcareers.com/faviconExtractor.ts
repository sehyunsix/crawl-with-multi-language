import fs from "fs/promises";
import { FaviconExtractor } from "../../shared/extractor.js";

const faviconExtractor = new FaviconExtractor(
  "https://www.skcareers.com/resources/images/favicon.ico?v=2025-10-27%20%EC%98%A4%EC%A0%84%2010:34:00",
);
export default faviconExtractor;
