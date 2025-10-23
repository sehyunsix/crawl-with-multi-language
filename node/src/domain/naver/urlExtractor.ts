import type { JobUrlExtractor , JobUrl } from "../../shared/base.js";


class NaverJobUrlExractor implements JobUrlExtractor {

    private domain : string  = "recruit.naver.com";
    
    public getDomain(): string {
        return this.domain;
    }

    async extractJobUrls(): Promise<JobUrl[] | null> {        
        const responese =await fetch(
        `https://recruit.navercorp.com/rcrt/loadJobList.do?annoId=&sw=&subJobCdArr=&sysCompanyCdArr=&empTypeCdArr=&entTypeCdArr=&workAreaCdArr=&firstIndex=${0}&recordCountPerPage=${100}&locale=ko`, 
        {
        "method": "GET"
        });
        const jobUrls=  await responese.json().then(data => (data.list.map( (job: any) => ( {
            url: job.jobDetailLink,
            createdAt: new Date().toISOString()
        } ) ) ) );
        return jobUrls;
    }
}


const naverJobUrlExractor = new NaverJobUrlExractor();
module.exports = naverJobUrlExractor;
