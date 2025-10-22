import  type { Job} from  "../base.ts";

function  rawJobTypeTextToEnum( rawText : string | null ) : "정규직" | "인턴" | null {

    let jobType: "정규직" | "인턴" | null = null;
    switch (rawText) {
        case "정규직":
            jobType = "정규직";
            break;
        case "인턴":
            jobType = "인턴";
            break;
        default:
            jobType = "정규직";
    }
    return jobType;
}


function  rawRequireExperienceTextToEnum( rawText : string ) : "신입" | "경력" | null {

    let requireExperience: "신입" | "경력" | null = null;
    if (rawText.includes("신입")) {
        requireExperience = "신입";
    } else {
        requireExperience = "경력";
    }
    return requireExperience;
}

module.exports = {
    rawJobTypeTextToEnum,
    rawRequireExperienceTextToEnum
};