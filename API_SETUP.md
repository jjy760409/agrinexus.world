# 🔌 AgriNexus World OS - API 설정 가이드

## 📋 API가 필요한 기능 목록

| 기능 | API | 용도 | 무료? |
|------|-----|------|-------|
| 🤖 AI 챗봇 | OpenAI | 스마트팜 질문 답변 | 💰 유료 |
| 🌤️ 날씨 예보 | OpenWeatherMap | 실시간 기상 정보 | ✅ 무료 |
| 🗺️ 지도 | Google Maps | 농장 위치 표시 | ✅ 무료* |
| 📊 시장 가격 | 공공데이터포털 | 농산물 시세 | ✅ 무료 |
| 📧 알림 | SendGrid | 이메일 알림 | ✅ 무료* |
| 💬 실시간 채팅 | Pusher | 협업 채팅 | ✅ 무료* |

*일정 사용량까지 무료

---

## 🚀 1단계: Vercel 환경변수 설정

### 설정 방법
1. **Vercel 대시보드** → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 아래 값들을 하나씩 추가

---

## 🤖 OpenAI API (AI 챗봇)

### 키 발급
1. https://platform.openai.com 접속
2. 로그인 → API Keys → Create new key
3. 키 복사

### Vercel에 추가
```
이름: OPENAI_API_KEY
값: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🌤️ OpenWeatherMap API (날씨)

### 키 발급 (무료)
1. https://openweathermap.org/api 접속
2. 회원가입 → API Keys 탭
3. 키 복사 (자동 생성됨)

### Vercel에 추가
```
이름: OPENWEATHER_API_KEY
값: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🗺️ Google Maps API (지도)

### 키 발급
1. https://console.cloud.google.com 접속
2. 새 프로젝트 생성
3. APIs & Services → Credentials
4. Create Credentials → API Key

### Vercel에 추가
```
이름: NEXT_PUBLIC_GOOGLE_MAPS_KEY
값: AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📊 공공데이터포털 API (농산물 시세)

### 키 발급 (무료)
1. https://www.data.go.kr 접속
2. 회원가입 → 로그인
3. "농산물 가격" 검색
4. 활용신청 → 키 발급

### Vercel에 추가
```
이름: KOREA_DATA_API_KEY
값: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📧 SendGrid API (이메일 알림)

### 키 발급
1. https://sendgrid.com 접속
2. 회원가입 → Settings → API Keys
3. Create API Key

### Vercel에 추가
```
이름: SENDGRID_API_KEY
값: SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 💬 Pusher API (실시간 채팅)

### 키 발급
1. https://pusher.com 접속
2. 회원가입 → Create App
3. App Keys 탭에서 복사

### Vercel에 추가 (4개)
```
이름: NEXT_PUBLIC_PUSHER_KEY
값: xxxxxxxxxxxxxxxx

이름: PUSHER_APP_ID
값: xxxxxxx

이름: PUSHER_SECRET
값: xxxxxxxxxxxxxxxx

이름: NEXT_PUBLIC_PUSHER_CLUSTER
값: ap3
```

---

## ✅ 환경변수 설정 완료 후

1. Vercel에서 **Redeploy** 클릭
2. 새 배포가 완료되면 API 사용 가능!

---

## 🎯 우선순위 추천

### 1순위 (무료, 쉬움)
- ✅ OpenWeatherMap - 날씨 정보

### 2순위 (무료, 중간)
- ✅ 공공데이터포털 - 농산물 시세

### 3순위 (유료, 강력)
- 💰 OpenAI - AI 챗봇
