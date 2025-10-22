import type { JobUrlExtractor , JobUrl } from "../../base.js";
const puppeteer = require("puppeteer");

class DonamuJobUrlExtractor implements JobUrlExtractor {

    private domain : string  = "www.dunamu.com";
    
    public getDomain(): string {
        return this.domain;
    }

    async extractJobUrls(): Promise<JobUrl[] | null> {

     

        const browser = await puppeteer.launch({ headless: true });
        
        const page = await browser.newPage();

        await page.goto("https://www.dunamu.com/careers/jobs?category=engineering", { waitUntil: "domcontentloaded"});
    
        const selector = "a[href^='/careers/jobs']";

        await page.waitForSelector(selector);
    
        const urls = await page.evaluate(() =>
            Array.from(document.querySelectorAll("a[href^='/careers/jobs']"))
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


const donamuJoBUrlExtractor = new DonamuJobUrlExtractor();
module.exports = donamuJoBUrlExtractor;
