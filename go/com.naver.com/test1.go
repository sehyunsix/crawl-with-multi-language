package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	// 1. GET 요청 보내기
	resp, err := http.Get("https://www.naver.com")
	if err != nil {
		fmt.Println("요청 오류:", err)
		return
	}

	defer resp.Body.Close()

	// 2. 파일 생성
	file, err := os.Create("naver.html")
	if err != nil {
		fmt.Println("파일 생성 오류:", err)
		return
	}

	defer file.Close()

	// 3. 응답 본문을 파일로 복사
	_, err = io.Copy(file, resp.Body)
	if err != nil {
		fmt.Println("파일 저장 오류:", err)
		return
	}

	fmt.Println("HTML이 naver.html 파일로 저장되었습니다!")
}
