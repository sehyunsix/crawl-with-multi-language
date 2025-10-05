#include <webdriverxx/webdriver.h>
#include <webdriverxx/browsers/chrome.h>
#include <webdriverxx/by.h>
#include <iostream>

using namespace webdriverxx;

int main() {
    try {
        // Chrome 브라우저 시작
        WebDriver driver = Start(Chrome());

        // 페이지 이동
        driver.Navigate("https://www.naver.com");

        // 페이지 소스 가져오기
        std::string html = driver.GetSource();
        std::cout << "페이지 로드 완료" << std::endl;

        // 버튼 찾기 (태그명으로 찾기)
        std::vector<Element> buttons = driver.FindElements(ByTag("button"));
        std::cout << "찾은 버튼 개수: " << buttons.size() << std::endl;

        // 각 버튼 클릭
        for (auto& btn : buttons) {
            try {
                // 버튼이 보이는지 확인하고 클릭
                if (btn.IsDisplayed()) {
                    btn.Click();
                    std::cout << "버튼 클릭 완료" << std::endl;
                }
            } catch (const WebDriverException& e) {
                std::cerr << "버튼 클릭 실패: " << e.what() << std::endl;
            }
        }

        // 다시 페이지 소스 가져오기
        html = driver.GetSource();

        // 브라우저 종료
        driver.CloseCurrentWindow();

    } catch (const WebDriverException& e) {
        std::cerr << "WebDriver 오류: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}