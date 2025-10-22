import type { JobExtractor , Job , JobUrl } from "../base.js";
const path = require('path'); // 파일 경로를 위해 path 모듈 사용
const puppeteer = require("puppeteer");

class TossJobExtractor implements JobExtractor {
    
 
    async extractJobDetail( source : JobUrl ): Promise< Job[] | null> {


        const url = source.url;
        
        const browser = await puppeteer.launch({ headless: true });
        
        const page = await browser.newPage();
        
        await page.goto( url , { waitUntil: "domcontentloaded"});

        await page.addScriptTag({ path: path.resolve('./src/utils/browser-util.js') });

        await page.waitForSelector("span[class^='css-nkt64x']");

        const job = await page.evaluate( () => {
     
        const win = (window as any);
        const title = win.safeGetText("span[class^='css-nkt64x']"); 
        const company = win.safeGetText("a[class^='css-1egxyvc']"); // "토스뱅크"
        const rawJobsText = win.safeGetText("div[class^='css-1urdq9i']");
        const departmentDescription =win.getContentByTitle("p[class^='css-92x98k']", "합류하게 될 팀에 대해 알려드려요");
        const department = win.extractTeamEntities(departmentDescription)[0] || null;
        const checkBeforeApply = win.getContentByTitle("p[class^='css-92x98k']", "지원 전 꼭 확인해주세요!");
        const jobDescription = win.getContentByTitle("p[class^='css-92x98k']", "합류하면 함께 할 업무에요") +departmentDescription;
        const requirements = win.getContentByTitle("p[class^='css-92x98k']", "이런 분과 함께하고 싶어요");
        let  jobTypeRaw = null;
        let texts = win.safeGetChildsText("div[class^='css-1kbe2mo eh5ls9o0']")
        if (texts.length >=2){
            jobTypeRaw = texts[1];
        }
        let jobType: "정규직" | "인턴" | null = null;
        switch (jobTypeRaw) {
            case "정규직":
                jobType = "정규직";
                break;
            case "인턴":
                jobType = "인턴";
                break;
            default:
                jobType = "정규직";
        }
    
     
        let requireExperience: "신입" | "경력" | null = null;
        if (checkBeforeApply.includes("신입")) {
            requireExperience = "신입";
        } else {
            requireExperience = "경력";
        }

        // --- 최종 반환 객체 ---
        return {
                    id: 0,
                    title: title,
                    rawJobsText: rawJobsText,
                    company: company,
                    requireExperience: requireExperience,
                    jobType: jobType,
                    regionText: null,
                    requirements: requirements,
                    department: department,
                    jobDescription: jobDescription,
                    idealCandidate:  null,
                    preferredQualifications: null,
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
        const extractor = new TossJobExtractor();
        const testUrl : JobUrl = {
            url: "https://toss.im/career/job-detail?job_id=6639083003",
            domain: "toss.im",
            createdAt: new Date().toISOString()
        };
        const jobs = await extractor.extractJobDetail( testUrl );
        console.log( jobs );
    } )();
}

const tossJobExtractor = new TossJobExtractor();
module.exports = tossJobExtractor;