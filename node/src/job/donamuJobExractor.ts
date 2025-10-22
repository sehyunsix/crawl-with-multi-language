import type { JobExtractor , Job , JobUrl } from "../base.js";
const  JobUtil = require("../utils/job.ts")
const path = require('path'); // 파일 경로를 위해 path 모듈 사용
const puppeteer = require("puppeteer");

class DunamuJobExtractor implements JobExtractor {
    
 
    async extractJobDetail( source : JobUrl ): Promise< Job[] | null> {


        const url = source.url;
        
        const browser = await puppeteer.launch({ headless: true });
        
        const page = await browser.newPage();
        
        await page.goto( url , { waitUntil: "domcontentloaded"});

        await page.addScriptTag({ path: path.resolve('./src/utils/browser-util.js') });

        await page.waitForSelector(".board_tit > p");

        const job = await page.evaluate( () => {
     
        const win = (window as any);
        const title = win.safeGetText(".board_tit > p"); 
        const rawJobsText = win.safeGetText(".board_txt");
        const departmentDescription =win.getContentAfterTitle(".article.top", "조직 소개")
        const department = win.extractTeamEntities(departmentDescription)[0] || null;
        const jobDescription = win.getContentAfterTitle(".article.top","주요업무");
        const requirements = win.getContentAfterTitle(".article.top" ,"자격요건")
        const preferredQualifications = win.getContentAfterTitle(".article.top","우대사항")
        const company = "두나무"
        const regionText =win.getContentByText("li", "근무지역").split(":")[1];
        const jobType = win.rawJobTypeTextToEnum( win.getContentByText("li","고용형태") );
        const requireExperience =win.rawRequireExperienceTextToEnum( win.getContentByText("li","채용유형")  );
    
    // --- 최종 반환 객체 ---
        return {
                    id: 0,
                    title: company + " " + title,
                    rawJobsText: rawJobsText,
                    company: company,
                    requireExperience: requireExperience,
                    jobType: jobType,
                    regionText: regionText,
                    requirements: requirements,
                    department: department,
                    jobDescription: jobDescription,
                    idealCandidate:  null,
                    preferredQualifications: preferredQualifications,
                    applyStartDate: null,
                    applyEndDate: null,
                    url: window.location.href,
                }
            }
        );

        await browser.close();
        return [ job ];
    }
}


if ( require.main === module ) {
    ( async () => {
        const extractor = new DunamuJobExtractor();
        const testUrl : JobUrl = {
            url: "https://www.dunamu.com/careers/jobs/1521",
            createdAt: new Date().toISOString()
        };
        const jobs = await extractor.extractJobDetail( testUrl );
        console.log( jobs );
    } )();
}

const dunamuJobExtractor = new DunamuJobExtractor();
module.exports = dunamuJobExtractor;