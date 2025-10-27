import fs from "fs/promises";
const response = await fetch("https://www.dunamu.com/favicon.png", {
  headers: {
    accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  },
  method: "GET",
});
// 응답 본문을 바이너리 버퍼로 변환
const buffer = Buffer.from(await response.arrayBuffer());
// 이미지 파일로 저장
await fs.writeFile("./src/domain/donamu/favicon.png", buffer);

console.log("✅ favicon.png 저장 완료!");
