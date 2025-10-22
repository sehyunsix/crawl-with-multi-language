import type { JobExtractor , Job , JobUrl } from "../base.js";
const  JobUtil = require("../utils/job.ts")
const path = require('path'); // 파일 경로를 위해 path 모듈 사용
const puppeteer = require("puppeteer");

class NaverJobExtractor implements JobExtractor {
    
 
    async extractJobDetail( source : JobUrl ): Promise< Job[] | null> {


        const url = source.url;
        
        const browser = await puppeteer.launch({ headless: true });
        
        const page = await browser.newPage();
        
        await page.goto( url , { waitUntil: "domcontentloaded"});

        await page.addScriptTag({ path: path.resolve('./src/utils/browser-util.js') });
        page.on('console', async (msg : any) => {
        // 메시지 타입에 따라 Node.js 콘솔 함수를 다르게 호출 (log, error, warn 등)
        const msgType = msg.type();
        
        // msg.args()는 JSHandle 객체의 배열이므로, jsonValue()로 실제 값을 비동기적으로 가져옵니다.
        const args = await Promise.all(msg.args().map( (arg :any)  => arg.jsonValue()));

            // Node.js 콘솔에 출력
            console.log('[브라우저]', ...args);
            
        });

        await page.waitForSelector(".card_title");
        
        
        const response =await fetch(
            source.url.replace("view.do", "loadJobList.do" )+"&recordCountPerPage=1", {
            "method": "GET"
        });
      

        const jobPreDetail = (await response.json()).list[0];
        
    
        // console.log( jobPreDetail );

        const job = await page.evaluate( (jobPreDetail : any) : Job => {

        const  datetime = (dateTimeString : string) : string => {
            console.log( "dateTimeString" , dateTimeString );
            const isoString = dateTimeString
                .replace('.', '-') 
                .replace('.', '-')
                .replace(' ', 'T');  

            return (new Date(isoString)).toISOString();
        }
     
        const win = (window as any);
        const rootElement = document.querySelector(".detail_box");
        const title = win.safeGetText(".card_title"); 
        const rawJobsText = win.safeGetText(".detail_box");
        const company = "네이버"
        const jobType = win.rawJobTypeTextToEnum( jobPreDetail.empTypeCdNm );
        const regionText =win.getContentByText("li", "근무지역").split(":")[1];
        const departmentDescription =win.getContentBetweenTitles(rootElement,"Who We Are", "What You'll Do" )
        const department = win.extractTeamEntities(departmentDescription)[0] || null;
        const jobDescription = win.getContentBetweenTitles(rootElement,"What You'll Do","Preferred Skills");
        const preferredQualifications = win.getContentBetweenTitles(rootElement, "Preferred Skills","전형절차 및 일정")
        const requireExperience =win.rawRequireExperienceTextToEnum( jobPreDetail.entTypeCdNm );
        const applyStartDate = datetime(jobPreDetail.staYmdTime)
        const applyEndDate = datetime(jobPreDetail.endYmdTime)
        console.log( applyStartDate , applyEndDate );
    
    // --- 최종 반환 객체 ---
        return {
                    id: "0",
                    title: company + " " + title,
                    rawJobsText: rawJobsText,
                    company: company,
                    requireExperience: requireExperience,
                    jobType: jobType,
                    regionText: regionText,
                    requirements: "",
                    department: department,
                    jobDescription: jobDescription,
                    idealCandidate:  null,
                    preferredQualifications: preferredQualifications,
                    applyStartDate: applyStartDate,
                    applyEndDate: applyEndDate,
                    url: window.location.href,
                    createdAt: new Date().toISOString(),
                }
            } , jobPreDetail
        );

        await browser.close();
        return [ job ];
    }
}


if ( require.main === module ) {
    ( async () => {
        const extractor = new NaverJobExtractor();
        const testUrl : JobUrl = {
            url: "https://recruit.navercorp.com/rcrt/view.do?annoId=30004007",
            createdAt: new Date().toISOString()
        };
        const jobs = await extractor.extractJobDetail( testUrl );
        console.log( jobs );
    } )();
}

const naverJobExtractor = new NaverJobExtractor();
module.exports = naverJobExtractor;