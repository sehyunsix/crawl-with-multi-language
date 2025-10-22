import type { JobUrlExtractor , JobUrl } from "../../base.js";
const puppeteer = require("puppeteer");
const autoScroll =require("../../utils/page.ts");

class LineJobUrlExtractor implements JobUrlExtractor {

    private domain : string  = "careers.linecorp.com";
    
    public getDomain(): string {
        return this.domain;
    }

    async extractJobUrls(): Promise<JobUrl[] | null> {

     

        const browser = await puppeteer.launch({ headless: true });
        
        const page = await browser.newPage();

        await page.goto("https://careers.linecorp.com/jobs", { waitUntil: "domcontentloaded"});

        await autoScroll(page ,10);

        const selector = "a[href^='/jobs/']";

        await page.waitForSelector(selector);
    
        const urls = await page.evaluate(() =>
            Array.from(document.querySelectorAll("a[href^='/jobs/']"))
                .map(a  => ( a as  HTMLAnchorElement).href)
        );
    
        await browser.close();
        
        const results: JobUrl[] = urls.map( (url: string) => ( {
            url,
            createdAt: new Date().toISOString()
        } ) );
        return results;
    }
}


const tossJoBUrlExtractor = new LineJobUrlExtractor();
module.exports = tossJoBUrlExtractor;
