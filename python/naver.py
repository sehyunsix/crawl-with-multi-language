from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time

# 1️⃣ 브라우저 실행
options = webdriver.ChromeOptions()
options.headless = False  # 브라우저 창 표시
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    # 2️⃣ naver.com 접속
    driver.get("https://www.naver.com")
    time.sleep(2)  # 페이지 로딩 대기

    # 3️⃣ 클릭 전 HTML 가져오기
    html_before = driver.page_source
    print("클릭 전 HTML 길이:", len(html_before))

    # 4️⃣ 모든 버튼 클릭
    buttons = driver.find_elements(By.TAG_NAME, "button")
    for btn in buttons:
        try:
            btn.click()
        except:
            pass  # 클릭 불가 버튼 무시

    time.sleep(2)  # 클릭 후 대기

    # 5️⃣ 클릭 후 HTML 가져오기
    html_after = driver.page_source
    print("클릭 후 HTML 길이:", len(html_after))

    # 6️⃣ 버튼 텍스트 가져오기
    button_texts = [b.text for b in driver.find_elements(By.TAG_NAME, "button")]

    # 특정 키워드 포함 버튼 필터링
    keyword = "확인"
    matched_buttons = [text for text in button_texts if keyword in text]

    print("찾은 버튼들:", matched_buttons)

finally:
    driver.quit()
