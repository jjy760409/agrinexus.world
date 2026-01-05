# AgriNexus World OS - 도메인 연결 가이드

## 도메인 정보
- **도메인**: agrinexus.world
- **등록업체**: 가비아 (Gabia)

---

## 배포 옵션 (권장 순서)

### 옵션 1: Vercel (권장) ⭐
Next.js 제작사의 플랫폼, 가장 쉬운 배포

### 옵션 2: AWS Amplify
AWS 생태계와 통합

### 옵션 3: Cloudflare Pages
글로벌 CDN과 보안

---

## Vercel 배포 단계

### 1단계: Vercel 계정 및 프로젝트
1. [vercel.com](https://vercel.com) 접속
2. GitHub/GitLab 계정으로 가입
3. "Import Project" 클릭
4. agrinexus-world-3 폴더 업로드 또는 Git 연결

### 2단계: 프로젝트 설정
- Framework: **Next.js** (자동 감지)
- Build Command: `npm run build`
- Output Directory: `.next`

### 3단계: 배포
- "Deploy" 클릭 → 약 2-3분 소요
- 배포 완료 시 `*.vercel.app` 주소 생성

---

## 가비아 DNS 설정

### Vercel 연결 시 설정

1. **가비아 로그인** → My가비아 → DNS 관리
2. **agrinexus.world 선택** → DNS 설정

### DNS 레코드 추가

| 타입 | 호스트 | 값 | TTL |
|------|--------|----|----|
| **A** | @ | 76.76.21.21 | 3600 |
| **CNAME** | www | cname.vercel-dns.com | 3600 |

### 상세 단계
1. "레코드 추가" 클릭
2. 타입: **A**
3. 호스트: **@** (또는 빈칸)
4. 값: **76.76.21.21**
5. TTL: 3600
6. 저장

7. "레코드 추가" 클릭
8. 타입: **CNAME**
9. 호스트: **www**
10. 값: **cname.vercel-dns.com**
11. TTL: 3600
12. 저장

---

## Vercel에서 도메인 연결

1. Vercel 프로젝트 대시보드
2. **Settings** → **Domains**
3. **Add Domain** 클릭
4. `agrinexus.world` 입력
5. **Add** 클릭
6. DNS 확인 대기 (최대 48시간, 보통 5-30분)

---

## SSL 인증서
✅ Vercel이 자동으로 Let's Encrypt SSL 발급 (무료)

---

## 배포 후 접속 URL

| URL | 설명 |
|-----|------|
| https://agrinexus.world | 메인 |
| https://agrinexus.world/hyperevolution | 초진화 AI |
| https://agrinexus.world/superintelligence | 초지능 |
| https://agrinexus.world/smartfarm | 스마트팜 |

---

## 문제 해결

### DNS 전파 확인
```
nslookup agrinexus.world
```

### 도메인 확인 실패 시
1. 가비아 DNS 설정 재확인
2. TTL 대기 (최대 48시간)
3. Vercel DNS 확인 버튼 클릭

---

## 다음 단계
✅ 도메인 연결 후 시스템 업그레이드 계속 진행
