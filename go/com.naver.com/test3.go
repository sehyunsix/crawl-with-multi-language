package main

import (
	"context"
	"fmt"
	"time"

	"github.com/chromedp/chromedp"
)

func main() {
	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	// 5초 타임아웃 설정
	ctx, cancel = context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	var title string
	err := chromedp.Run(ctx,
		chromedp.Navigate("https://www.naver.com"),
		chromedp.Title(&title),
	)
	if err != nil {
		fmt.Println("에러:", err)
		return
	}
	fmt.Println("Title:", title)

	err = chromedp.Run(ctx,
		chromedp.Navigate("https://www.google.com"),
		chromedp.Title(&title),
	)

	if err != nil {
		fmt.Println("에러:", err)
		return
	}
	fmt.Println("Title:", title)

}
