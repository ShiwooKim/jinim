# 지님 (Jinim)

브랜드 웹 및 이후 제품을 위한 Next.js 프로젝트입니다.

- **원격 저장소:** [github.com/ShiwooKim/jinim](https://github.com/ShiwooKim/jinim)
- **스택 요약:** `stack.md`
- **기획·브랜드 기준(최종본):** `docs/` — `brand-def.md`, `브랜드웹-기획서.md`, `bi-design-plan.md`
- **초기 아이데이션·작업계획 등:** `archive/planning-early/`

## 개발

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## 폴더 구조 (시작점)

```
src/
  app/          # App Router
  components/   # 공용 UI
  lib/          # 유틸·클라이언트 등
  styles/       # 전역 스타일 (globals.css)
public/
docs/           # 브랜드·랜딩 기획 최종 문서
archive/        # 참고용 이전 단계 문서
```

## GitHub · 배포 상태

- **`main` 브랜치**는 [github.com/ShiwooKim/jinim](https://github.com/ShiwooKim/jinim) 에 푸시된 상태입니다.
- **Vercel 프로덕션 URL**은 이 저장소에 Vercel 계정을 연결해야 생깁니다. 아래 순서로 한 번만 Import 하면 첫 배포가 완료됩니다.

## Vercel 연동 (다음에 할 셋업)

1. [Vercel 대시보드 → Add New… → Project](https://vercel.com/new) 로 이동합니다.
2. **Import Git Repository**에서 `ShiwooKim/jinim` 저장소를 선택합니다. (처음이면 GitHub 앱 권한을 허용합니다.)
3. **Framework Preset**은 Next.js로 자동 인식되는지 확인합니다. **Root Directory**는 `./` 그대로 둡니다.
4. **Environment Variables**는 지금 비워 두어도 됩니다. Supabase·OpenAI 등은 값이 생긴 뒤 같은 화면에서 추가하면 됩니다.
5. **Deploy**를 누르면 빌드가 끝난 뒤 `*.vercel.app` 주소가 발급됩니다.

**커스텀 도메인 (`jinim.kr`)** 은 Vercel 프로젝트 → *Settings* → *Domains* 에서 추가한 뒤, 도메인 구매처 DNS에 Vercel이 안내하는 레코드를 넣으면 됩니다.

**CLI로 연결하려면** (선택): 로컬 터미널에서 `npx vercel login` 으로 로그인한 다음, 이 저장소 루트에서 `npx vercel link` → `npx vercel --prod` 순으로 실행합니다. CI나 자동화에는 [Vercel 토큰](https://vercel.com/account/tokens)과 `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` 를 쓰는 방식이 안전합니다.
