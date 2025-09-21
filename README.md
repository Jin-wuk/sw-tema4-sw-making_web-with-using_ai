# 강원도 정보 웹 애플리케이션

React와 Node.js를 이용해서 강원도의 날씨, 주차장, 반려동물, 착한업소 정보를 볼 수 있는 웹 애플리케이션입니다.

## 🚀 주요 기능

### 🌤️ 날씨 정보
- 강원도 전 지역 실시간 날씨 정보
- 도시별 날씨 검색
- 5일 날씨 예보
- 기온, 습도, 풍속, 날씨 상태 제공

### 🅿️ 주차장 정보
- 실시간 주차 공간 현황
- 주차장 요금 정보
- 운영시간 및 편의시설 정보
- 도시별, 유형별 필터링

### 🐕 반려동물 서비스
- 동물병원, 펫샵, 펫파크 정보
- 반려동물 동반 가능 장소
- 반려동물 케어 팁
- 서비스별 상세 정보

### 🏪 착한업소
- 사회적 가치를 실현하는 업소 소개
- 공공기관, 복지기관, 사회적기업 등
- 인증업소 표시
- 평점 및 리뷰 시스템

## 🛠️ 기술 스택

### Backend
- **Node.js** - 서버 런타임
- **Express.js** - 웹 프레임워크
- **CORS** - 크로스 오리진 리소스 공유
- **Helmet** - 보안 미들웨어
- **Morgan** - 로깅 미들웨어

### Frontend
- **React 18** - UI 라이브러리
- **React Router** - 클라이언트 사이드 라우팅
- **Styled Components** - CSS-in-JS 스타일링
- **React Icons** - 아이콘 라이브러리
- **Axios** - HTTP 클라이언트

## 📁 프로젝트 구조

```
sw-tema4-sw-making_web-with-using_ai/
├── server.js                 # Express 서버 메인 파일
├── package.json              # Node.js 의존성
├── config.example.js         # 환경 설정 예시
├── routes/                   # API 라우터
│   ├── weather.js           # 날씨 API
│   ├── parking.js           # 주차장 API
│   ├── pets.js              # 반려동물 API
│   └── businesses.js        # 착한업소 API
└── client/                   # React 클라이언트
    ├── package.json         # React 의존성
    ├── public/              # 정적 파일
    └── src/
        ├── App.js           # 메인 앱 컴포넌트
        ├── components/      # 공통 컴포넌트
        │   ├── Header.js
        │   └── Navigation.js
        └── pages/           # 페이지 컴포넌트
            ├── Home.js
            ├── Weather.js
            ├── Parking.js
            ├── Pets.js
            └── Businesses.js
```

## 🚀 실행 방법

### 1. 프로젝트 클론
```bash
git clone [repository-url]
cd sw-tema4-sw-making_web-with-using_ai
```

### 2. 백엔드 의존성 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 5000)
npm run dev
```

### 3. 프론트엔드 의존성 설치 및 실행
```bash
# 클라이언트 디렉토리로 이동
cd client

# 의존성 설치
npm install

# 개발 서버 실행 (포트 3000)
npm start
```

### 4. 프로덕션 빌드
```bash
# 클라이언트 빌드
cd client
npm run build

# 프로덕션 서버 실행
cd ..
npm start
```

## 🌐 API 엔드포인트

### 날씨 API
- `GET /api/weather` - 전체 지역 날씨 정보
- `GET /api/weather?city=춘천` - 특정 도시 날씨
- `GET /api/weather/forecast` - 5일 예보

### 주차장 API
- `GET /api/parking` - 주차장 목록
- `GET /api/parking/:id` - 주차장 상세 정보
- `GET /api/parking/search/:keyword` - 주차장 검색
- `GET /api/parking/stats/summary` - 주차장 통계

### 반려동물 API
- `GET /api/pets/services` - 서비스 목록
- `GET /api/pets/places` - 동반 가능 장소
- `GET /api/pets/tips` - 케어 팁
- `GET /api/pets/stats` - 통계 정보

### 착한업소 API
- `GET /api/businesses` - 업소 목록
- `GET /api/businesses/:id` - 업소 상세 정보
- `GET /api/businesses/search/:keyword` - 업소 검색
- `GET /api/businesses/popular/top-rated` - 인기 업소

## 🎨 UI/UX 특징

- **반응형 디자인** - 모바일, 태블릿, 데스크톱 지원
- **모던한 UI** - 그라데이션과 글래스모피즘 디자인
- **직관적인 네비게이션** - 탭 기반 메뉴 시스템
- **실시간 정보** - 실시간 데이터 업데이트
- **검색 및 필터링** - 다양한 검색 옵션 제공

## 📱 브라우저 지원

- Chrome (권장)
- Firefox
- Safari
- Edge

## 🔧 개발 환경 설정

1. Node.js 16.x 이상 설치
2. npm 또는 yarn 패키지 매니저
3. 코드 에디터 (VSCode 권장)

## 📝 라이선스

MIT License

## 👥 팀 정보

- **팀명**: Team4
- **프로젝트**: 강원도 정보 웹 애플리케이션

---

**PR 없이 PUSH 금지!** 🚫