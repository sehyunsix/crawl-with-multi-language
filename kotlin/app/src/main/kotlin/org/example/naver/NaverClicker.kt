package org.example

import io.github.bonigarcia.wdm.WebDriverManager
import org.openqa.selenium.By
import org.openqa.selenium.WebDriver
import org.openqa.selenium.WebElement
import org.openqa.selenium.chrome.ChromeDriver

object NaverClicker {
    @JvmStatic
    fun run() {
        WebDriverManager.chromedriver().setup()
        val driver: WebDriver = ChromeDriver()
        driver.manage().window().maximize()

        try {
            driver.get("https://www.naver.com")
            Thread.sleep(2000)

            val htmlBefore = driver.pageSource
            println("클릭 전 HTML 길이: ${htmlBefore.length}")

            val buttons: List<WebElement> = driver.findElements(By.tagName("button"))
            buttons.forEach {
                try { it.click() } catch (_: Exception) {}
            }

            Thread.sleep(2000)

            val htmlAfter = driver.pageSource
            println("클릭 후 HTML 길이: ${htmlAfter.length}")

            val buttonTexts = driver.findElements(By.tagName("button")).map { it.text }
            val keyword = "확인"
            val matchedButtons = buttonTexts.filter { it.contains(keyword) }

            println("찾은 버튼들: $matchedButtons")
        } finally {
            driver.quit()
        }
    }
}
