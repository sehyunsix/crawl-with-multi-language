package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/chromedp/chromedp"
)

func main() {
	// 브라우저 컨텍스트 생성
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", false), // 브라우저 창 표시
		chromedp.Flag("disable-gpu", false),
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)

	defer cancel()
	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	// 전체 타임아웃
	ctx, cancel = context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	// 버튼 텍스트를 담을 slice
	var buttonTexts []string

	var htmlAfterClick string
	var htmlBeforeClick string

	// 특정 페이지 이동 및 버튼 텍스트 가져오기
	err := chromedp.Run(ctx,
		chromedp.Navigate("https://www.naver.com"), // 원하는 URL

		chromedp.OuterHTML("html", &htmlBeforeClick),
		// 모든 button 요소의 텍스트 가져오기
		chromedp.Evaluate(`Array.from(document.querySelectorAll("button"))
			.forEach(b => b.click())
		`, &buttonTexts),
		chromedp.OuterHTML("html", &htmlAfterClick),
	)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("클릭 전 HTML 길이:", len(htmlBeforeClick))
	fmt.Println("클릭 후 HTML 길이:", len(htmlAfterClick))
	// 특정 키워드를 포함하는 버튼만 필터링
	keyword := "확인"
	var matchedButtons []string
	for _, text := range buttonTexts {
		if text != "" && contains(text, keyword) {
			matchedButtons = append(matchedButtons, text)
		}
	}

	fmt.Println("찾은 버튼들:", matchedButtons)
}

// 문자열 포함 여부 확인 함수
func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(substr) == 0 || containsHelper(s, substr))
}

func containsHelper(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
