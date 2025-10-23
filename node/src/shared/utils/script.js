function safeGetText(selector) {
    const element = document.querySelector(selector);
    return element.innerText?.trim() || "";
}
function safeGetChildsText(selector) {
    const parentElement = document.querySelector(selector);
    if (!parentElement) {
        return [];
    }
    return Array.from(parentElement.children)
        .map(child => child.innerText?.trim() || "")
        .filter(text => text.length > 0);
}
function extractTeamEntities(text) {
    const regex = /\b[A-Z][a-z]+(?: [A-Z][a-z]+)* (?:Part|Department|파트)\b/g;
    const matches = text.match(regex);
    if (!matches) {
        return [];
    }
    return [...new Set(matches)];
}
function getContentByTitle(selector, titleText) {
    const allTitles = Array.from(document.querySelectorAll(selector));
    ;
    const titleElement = allTitles.find(p => p.innerText.trim() === titleText);
    if (!titleElement)
        return "";
    const contentElement = titleElement.nextElementSibling;
    return contentElement.innerText?.trim() || "";
}
;
function getContentByText(selector, text) {
    const allTitles = Array.from(document.querySelectorAll(selector));
    ;
    const titleElement = allTitles.find(p => p.innerText.trim().includes(text));
    if (!titleElement)
        return "";
    const contentElement = titleElement;
    return contentElement.innerText?.trim() || "";
}
;
function getContentBetweenTitles(rootElement, startTitle, endTitle = null) {
    if (!rootElement) {
        return ""; // 부모 요소가 없으면 즉시 종료
    }
    const content = [];
    let isCollecting = false; // 텍스트 수집 모드 플래그
    for (const child of Array(rootElement.children)) {
        // (HTMLElement로 간주하고 innerText를 가져옵니다)
        const text = child.innerText?.trim();
        if (!text) {
            continue;
        }
        if (isCollecting) {
            if (endTitle && text === endTitle) {
                isCollecting = false; // 수집 종료
                break; // 반복문 탈출
            }
            content.push(text);
        }
        else if (text === startTitle) {
            isCollecting = true; // 다음 요소부터 수집 시작
        }
    }
    return content.join('\n'); // 수집된 텍스트를 줄바꿈으로 합침
}
function getContentAfterTitle(selector, titleText) {
    const rootElement = document.querySelector(selector);
    if (!rootElement)
        return "";
    if (!rootElement.children)
        return "";
    const allChildren = Array.from(rootElement.children);
    const content = [];
    let isCollecting = false; // 텍스트 수집 모드 플래그
    for (const child of allChildren) {
        const strongTag = child.querySelector('strong');
        const isTitleTag = child.tagName === 'P' && strongTag;
        if (isTitleTag) {
            const currentTitleText = strongTag.innerText.trim();
            console.log("현재 제목 텍스트:", currentTitleText);
            if (currentTitleText === titleText) {
                isCollecting = true;
                continue;
            }
            else if (isCollecting) {
                isCollecting = false;
                break;
            }
        }
        if (isCollecting) {
            if (child.tagName === 'H5' && !child.innerText.trim()) {
                continue;
            }
            if (child.tagName === 'HR') {
                continue;
            }
            const text = child.innerText?.trim();
            if (text) {
                content.push(text);
            }
        }
    }
    return content.join('\n'); // 수집된 텍스트를 줄바꿈으로 합침
}
function rawJobTypeTextToEnum(rawText) {
    if (rawText.includes("인턴")) {
        return "인턴";
    }
    return "정규직";
}
function rawRequireExperienceTextToEnum(rawText) {
    return rawText?.includes("신입") ? "신입" : "경력";
}
