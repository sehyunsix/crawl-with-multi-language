function isMatch(a, b) {
  if (a instanceof RegExp) {
    return a.test(b);
  } else {
    return a === b;
  }
}

function safeGetText(selector) {
  console.log("[safeGetText] selector:", selector);
  const element = document.querySelector(selector);
  return element?.innerText?.trim() || "";
}
function safeGetChildsText(selector) {
  console.log("[safeGetChildsText]: ", selector);
  const parentElement = document.querySelector(selector);
  if (!parentElement) {
    return [];
  }
  return Array.from(parentElement.children)
    .map((child) => child.innerText?.trim() || "")
    .filter((text) => text.length > 0);
}
function extractTeamEntities(text) {
  console.log("[extractTeamEntities]: ", text);
  const regex = /\b[A-Z][a-z]+(?: [A-Z][a-z]+)* (?:Part|Department|파트)\b/g;
  const matches = text.match(regex);
  if (!matches) {
    return [];
  }
  return [...new Set(matches)];
}
function getContentByTitle(selector, titleText) {
  console.log("[getContentByTitle]: ", selector, titleText);
  const allTitles = Array.from(document.querySelectorAll(selector));
  const titleElement = allTitles.find((p) => p.innerText?.trim() === titleText);
  if (!titleElement) return "";
  const contentElement = titleElement.nextElementSibling;
  return contentElement?.innerText?.trim() || "";
}

function getContentByText(selector, text) {
  console.log("[getContentByText]:", selector, text);

  if (!selector || !text) {
    return "";
  }

  const elements = Array.from(document.querySelectorAll(selector) || []);
  if (!elements.length) {
    return "";
  }

  const target = elements.find((el) => {
    const value = el?.innerText?.trim();
    return typeof value === "string" && value.includes(text);
  });

  return target?.innerText?.trim() ?? "";
}

function getContentBetweenTitles(rootElement, startTitle, endTitle = null) {
  console.log("[getContentBetweenTitles]: ", startTitle, endTitle);
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
    } else if (text === startTitle) {
      isCollecting = true; // 다음 요소부터 수집 시작
    }
  }
  return content.join("\n"); // 수집된 텍스트를 줄바꿈으로 합침
}
function getContentAfterTitle(selector, titleText) {
  console.log("[getContentAfterTitle]: ", selector, titleText);
  const rootElement = document.querySelector(selector);
  if (!rootElement) return "";
  if (!rootElement.children) return "";
  const allChildren = Array.from(rootElement.children);
  const content = [];
  let isCollecting = false; // 텍스트 수집 모드 플래그
  for (const child of allChildren) {
    const strongTag = child.querySelector("strong");
    const isTitleTag = child.tagName === "P" && strongTag;
    if (isTitleTag) {
      const currentTitleText = strongTag.innerText?.trim();
      console.log("현재 제목 텍스트:", currentTitleText);
      if (currentTitleText === titleText) {
        isCollecting = true;
        continue;
      } else if (isCollecting) {
        isCollecting = false;
        break;
      }
    }
    if (isCollecting) {
      if (child.tagName === "H5" && !child.innerText?.trim()) {
        continue;
      }
      if (child.tagName === "HR") {
        continue;
      }
      const text = child.innerText?.trim();
      if (text) {
        content.push(text);
      }
    }
  }
  return content.join("\n"); // 수집된 텍스트를 줄바꿈으로 합침
}

function getContentAfterTitleAtMarkdownStyle(selector, titleText) {
  console.log("[getContentAfterTitleAtMarkdownStyle]: ", selector, titleText);
  const titles = document.querySelectorAll(selector);
  console.log("찾은 제목들:", titles);
  if (!titles) return "";
  for (const tilte of titles) {
    const text = tilte.innerText?.trim();
    console.log("찾은 제목", text);
    if (isMatch(titleText, text)) {
      const contentElements = [];
      let sibling = tilte.nextElementSibling;
      while (sibling) {
        if (sibling.tagName === "H2" || sibling.tagName === "H3" || sibling.tagName === "H4") {
          break;
        }
        contentElements.push(sibling.innerText?.trim() || "");
        sibling = sibling.nextElementSibling;
      }
      return contentElements.join("\n").trim();
    }
  }
  return null;
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

function getTextsFromTitledBox(boxSelector, titleSelector, targetTitle) {
  // 1. 모든 box 요소를 찾음
  const allBoxes = document.querySelectorAll(boxSelector);
  let pTexts = "";
  // 2. 각 box를 순회
  allBoxes.forEach((box) => {
    // 3. box 안의 title 요소를 찾음
    const titleElement = box.querySelector(titleSelector);

    if (titleElement) {
      const titleText = titleElement.textContent.trim();
      if (isMatch(targetTitle, titleText)) {
        const innerText = box?.innerText?.trim();
        if (innerText) {
          pTexts = innerText.replace(titleText, "").trim();
        }
      }
    }
  });
  // 6. 최종 결과 배열을 \n (줄바꿈)으로 합쳐서 반환
  return pTexts;
}

function splitAndFormatDateRange(dateRangeString) {
  // 1. '~'를 기준으로 문자열을 두 부분으로 분리합니다.
  const dateStrings = dateRangeString.split("~");

  // 2. 각 날짜 문자열을 YYYY-MM-DD 형식으로 변환하는 내부 함수
  const formatToMySQLDate = (str) => {
    if (!str) return null;

    // 'YYYY년 MM월 DD일' 패턴에 맞는 숫자를 추출합니다.
    // \s*는 공백이 있든 없든 처리, (\d{1,2})는 1자리 또는 2자리 숫자
    const matches = str.trim().match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);

    if (matches && matches.length === 4) {
      const year = matches[1];
      // 3월 -> 03월, 5일 -> 05일처럼 2자리로 맞춰줍니다. (MySQL 표준)
      const month = matches[2].padStart(2, "0");
      const day = matches[3].padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    return null; // 형식이 맞지 않으면 null 반환
  };

  // 3. 분리된 두 문자열에 각각 포맷팅 함수를 적용합니다.
  const startDate = formatToMySQLDate(dateStrings[0]);
  const endDate = formatToMySQLDate(dateStrings[1]);

  // 4. 객체로 반환합니다.
  return [startDate, endDate];
}
