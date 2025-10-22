import type { JobUrlExtractor , JobUrl } from "../base.js";

const autoScroll =require("../utils/page.ts");
const puppeteer = require("puppeteer");

class NaverJobUrlExractor implements JobUrlExtractor {

    private domain : string  = "recruit.naver.com";
    
    public getDomain(): string {
        return this.domain;
    }

    async extractJobUrls(): Promise<JobUrl[] | null> {

     

        const browser = await puppeteer.launch(
            { 
                headless: false,
                defaultViewport: {
                    width: 1920,
                    height: 1080
                }
             }
        );
        
        const page = await browser.newPage();

        const startUrl = "https://recruit.navercorp.com/rcrt/list.do"

        await page.goto(startUrl, { waitUntil: "domcontentloaded"});
    
        const selector = "a[href^='#n'][class='card_link']";

        await page.waitForSelector(selector);

        await autoScroll(page);
        
        const urls = await page.evaluate(() =>
            
            Array.from(document.querySelectorAll("a[href^='#n'][class='card_link']"))
                .map(a  => 
                {
                    const jobId : string | undefined =  ( a as  HTMLButtonElement).onclick!.toString().match(/'([^']+)'/)![1]
                    if ( !jobId ) {
                        throw new Error("Job ID not found in onclick attribute");
                    }
                    return "https://recruit.navercorp.com/rcrt/list.do" +"/"+jobId
                })
            )
        
        
        await browser.close();
        
        const results: JobUrl[] = urls.map( (url: string) => ( {
            url,
            domain: this.domain,
            createdAt: new Date().toISOString()
        } ) );
        return results;
    }
}


const naverJobUrlExractor = new NaverJobUrlExractor();
module.exports = naverJobUrlExractor;
