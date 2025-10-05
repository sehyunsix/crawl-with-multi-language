package org.example.naver;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.util.ArrayList;
import java.util.List;

public class NaverClicker {
    public static void run() throws InterruptedException {
        // 1️⃣ ChromeDriver 자동 설치
        WebDriverManager.chromedriver().setup();

        // 2️⃣ 브라우저 실행
        WebDriver driver = new ChromeDriver();
        driver.manage().window().maximize();

        try {
            // 3️⃣ naver.com 접속
            driver.get("https://www.naver.com");
            Thread.sleep(2000); // 페이지 로딩 대기

            // 4️⃣ 클릭 전 HTML 가져오기
            String htmlBefore = driver.getPageSource();
            System.out.println("클릭 전 HTML 길이: " + htmlBefore.length());

            // 5️⃣ 모든 버튼 클릭
            List<WebElement> buttons = driver.findElements(By.tagName("button"));
            for (WebElement btn : buttons) {
                try {
                    btn.click();
                } catch (Exception e) {
                    // 클릭 불가 버튼 무시
                }
            }

            Thread.sleep(2000); // 클릭 후 대기

            // 6️⃣ 클릭 후 HTML 가져오기
            String htmlAfter = driver.getPageSource();
            System.out.println("클릭 후 HTML 길이: " + htmlAfter.length());

            // 7️⃣ 버튼 텍스트 가져오기
            buttons = driver.findElements(By.tagName("button"));
            List<String> buttonTexts = new ArrayList<>();
            for (WebElement btn : buttons) {
                buttonTexts.add(btn.getText());
            }

            // 특정 키워드 포함 버튼 필터링
            String keyword = "확인";
            List<String> matchedButtons = new ArrayList<>();
            for (String text : buttonTexts) {
                if (text.contains(keyword)) {
                    matchedButtons.add(text);
                }
            }

            System.out.println("찾은 버튼들: " + matchedButtons);

        } finally {
            // 8️⃣ 브라우저 종료
            driver.quit();
        }
    }
}
