use std::fs;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    // naver.com 접속
    let response = reqwest::blocking::get("https://www.naver.com")?
        .text()?; // HTML 내용 가져오기

    // 파일로 저장
    fs::write("naver.html", &response)?;

    println!("naver.com HTML을 naver.html로 저장했습니다.");
    Ok(())
}