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

## GitHub · 배포

- **저장소:** [github.com/ShiwooKim/jinim](https://github.com/ShiwooKim/jinim) — `main` 푸시 시 Vercel이 자동 빌드·배포합니다.
- **프로덕션:** [https://jinim.kr](https://jinim.kr) (커스텀 도메인은 Vercel 프로젝트 *Settings* → *Domains* 에서 연결합니다.)
- **환경 변수:** 현재 랜딩만 있으면 비워 두어도 됩니다. API 연동 시 Vercel 같은 화면에서 추가하면 됩니다.

**CLI 배포** (Git 없이 올릴 때): `npx vercel login` 후 프로젝트 루트에서 `npx vercel link` → `npx vercel --prod`. CI에는 [Vercel 토큰](https://vercel.com/account/tokens)과 `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` 사용을 권장합니다.
