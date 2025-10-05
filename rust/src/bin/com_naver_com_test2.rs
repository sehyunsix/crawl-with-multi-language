use headless_chrome::{Browser, LaunchOptions};
use std::time::Duration;
use anyhow::Result;

fn main() -> Result<()> {
    // 브라우저 실행
    let browser = Browser::new(LaunchOptions {
        headless: false,
        ..Default::default()
    })?;

    let tab = browser.new_tab()?;
    tab.navigate_to("https://www.naver.com")?;
    tab.wait_until_navigated()?;

    let html_before = tab.get_content()?;
    println!("클릭 전 HTML 길이: {}", html_before.len());

    tab.evaluate(
        r#"Array.from(document.querySelectorAll("button")).forEach(b => b.click());"#,
        false,
    )?;

    std::thread::sleep(Duration::from_secs(2));

    let html_after = tab.get_content()?;
    println!("클릭 후 HTML 길이: {}", html_after.len());

    Ok(())
}
