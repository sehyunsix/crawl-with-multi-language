// browser-utils.js
// (module.exports, export, import, require 금지!)

function safeGetText(selector) {
    const element = document.querySelector(selector);
    return element?.innerText?.trim() || "";
}

function safeGetChildsText(selector) {
    const parentElement = document.querySelector(selector);
    if (!parentElement) {
        return [];
    }
    return Array.from(parentElement.children)
        .map(child => child?.innerText?.trim() || "")
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

function getContentByTitle( selector , titleText) {
    const allTitles = Array.from(document.querySelectorAll(selector));;
    const titleElement = allTitles.find(p => p.innerText.trim() === titleText);
    if (!titleElement) return "";
    const contentElement = titleElement.nextElementSibling;
    return contentElement?.innerText?.trim() || "";
};