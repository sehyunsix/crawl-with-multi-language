// .eslintrc.js
module.exports = {
  // TypeScript 파서를 사용하도록 설정
  parser: '@typescript-eslint/parser', 
  
  // 파서 옵션: ECMAScript 버전, 모듈 타입 지정
  parserOptions: {
    ecmaVersion: 2020, 
    sourceType: 'module', 
  },
  
  // 플러그인과 설정 세트 추가
  extends: [
    'eslint:recommended', // ESLint 기본 권장 규칙
    'plugin:@typescript-eslint/recommended', // TypeScript 권장 규칙
    'prettier', // Prettier와 충돌하는 린트 규칙 비활성화 (가장 마지막에 와야 함)
  ],
  
  // 프로젝트에 필요한 추가 규칙이나 사용자 지정 규칙 설정
  rules: {
    // 예시: 명시적인 any 사용을 허용하지 않음 (기본 설정에서 활성화되어 있을 수 있음)
    // "@typescript-eslint/no-explicit-any": "error", 
  },
};