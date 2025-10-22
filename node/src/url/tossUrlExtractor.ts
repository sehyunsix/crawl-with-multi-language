import type { JobUrlExtractor , JobUrl } from "../base.js";
const puppeteer = require("puppeteer");

class TossJobUrlExtractor implements JobUrlExtractor {

    private domain : string  = "toss.im";
    
    public getDomain(): string {
        return this.domain;
    }

    async extractJobUrls(): Promise<JobUrl[] | null> {

     

        const browser = await puppeteer.launch({ headless: true });
        
        const page = await browser.newPage();

        await page.goto("https://toss.im/career/jobs", { waitUntil: "domcontentloaded"});
    
        const selector = "a[href^='/career/job']";

        await page.waitForSelector(selector);
    
        const urls = await page.evaluate(() =>
            Array.from(document.querySelectorAll("a[href^='/career/job']"))
                .map(a  => ( a as  HTMLAnchorElement).href)
        );
    
        await browser.close();
        
        const results: JobUrl[] = urls.map( (url: string) => ( {
            url,
            domain: this.domain,
            createdAt: new Date().toISOString()
        } ) );
        return results;
    }
}


const tossJoBUrlExtractor = new TossJobUrlExtractor();
module.exports = tossJoBUrlExtractor;
