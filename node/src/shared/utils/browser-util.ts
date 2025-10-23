//type hint를 위한 함수 모음. 구현은 script에서 하여야함

export function safeGetText(selector : string) : string {
   return " "
}

export function safeGetChildsText(selector : string) : string[] {
    return []
}

export function extractTeamEntities(text : string) : string {
    return " ";
}

export function getContentByTitle( selector :string , titleText :string) : string {
    return " "
};

export function getContentByText( selector : string , text : string) : string {
    return " ";
};

export function getContentBetweenTitles(rootElement : Element, startTitle :string, endTitle = null) : string {
    return " ";  
}

export function getContentAfterTitle(selector:string , titleText :string) : string {
    return " ";
}

export function rawJobTypeTextToEnum(rawText: string) : "정규직" | "인턴"{
    return "정규직";
}

export function rawRequireExperienceTextToEnum(rawText: string) : "신입" | "경력" {
    return "경력" ;
}

