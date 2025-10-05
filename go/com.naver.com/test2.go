package main

import (
	"fmt"
	"net/http"

	"golang.org/x/net/html"
)

func main() {
	// 1. HTML 요청
	resp, err := http.Get("https://www.naver.com")
	if err != nil {
		fmt.Println("요청 오류:", err)
		return
	}
	defer resp.Body.Close()

	// 2. HTML 파싱
	doc, err := html.Parse(resp.Body)
	if err != nil {
		fmt.Println("HTML 파싱 오류:", err)
		return
	}

	// 3. 재귀적으로 <a> 태그의 href 속성 추출
	var f func(*html.Node)
	f = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "a" {
			for _, attr := range n.Attr {
				if attr.Key == "href" {
					fmt.Println(attr.Val)
				}
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c)
		}
	}
	f(doc)
}
