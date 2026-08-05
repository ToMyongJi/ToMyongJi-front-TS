# 투명지 프론트엔드 — 기술 부채 / 성능 최적화 조사

> 최초 조사 2026-07-22 · 재검증 2026-07-29 · 재작성 2026-08-05 (기준 커밋 `21dc118`)
> **상태: 조사 완료 / 구현 보류.** 남은 항목 **13건** (+ P3 별도 작업 6건).
> 해결된 항목은 본문에서 빼고 문서 끝 [해결 이력](#해결-이력)에 모았다.

---

## Executive Summary

### 코드베이스 기본 품질은 높다

`any` 1건, `@ts-ignore` 0건, `tsc -b` 통과, TODO 0건, FSD 유사 구조가 일관되게 지켜지고 있다.
부채는 **코드 품질**이 아니라 두 곳에 집중돼 있다.

1. **횡단 관심사의 부재** — 에러 처리, CI, 테스트가 통째로 비어 있다
2. **누적된 설정 잔해** — 쓰지 않는 의존성, 락파일 2개 공존, 동작하지 않는 스크립트

### 즉시 조치가 필요한 1건 (성능과 무관)

| # | 문제 | 위치 |
|---|---|---|
| 1 | 모듈 import 시점에 무조건 API 호출 | `student-club-store.ts:198` |

> 함께 조사됐던 **평문 비밀번호·학번 콘솔 출력**과 **테스트 전용 라우트 노출**은 해결됐다
> → [해결 이력](#해결-이력)

### 조사로만 드러난 사실 (코드를 읽어서는 바로 알기 어려움)

- **`npm run lint:fix`가 동작 불능** — Biome 2.x에서 제거된 `--apply` 플래그를 쓴다 (현재 2.2.4).
  실행 시 `Error: --apply is not expected in this context`
- **`react-js-pagination`은 유령 의존성** — dependencies에 있으나 실제 import 0건.
  `pagination-custom.tsx`는 이 라이브러리를 쓰지 않는 **완전 커스텀 구현**이다.
  그런데 `components/AGENTS.md:13`과 `pages/admin/AGENTS.md:24`가 "래퍼"라고 **잘못 문서화**하고 있다
- **여러 `AGENTS.md`가 실제 코드와 어긋난다.** 특히 `store/AGENTS.md:16-17`의 layout/sidebar 스토어
  설명은 **정반대**다 (실제로는 사이드바 열림 상태가 `layout-store`, 선택된 학생회가 `sidebar-store`).
  **문서를 믿고 작업하면 틀린다**
- **테스트/스토리 파일이 0개**인데 vitest · `@vitest/browser` · `@vitest/coverage-v8` · playwright ·
  storybook 관련 5종이 설치돼 있다. **vitest 설정 파일도 `test` 스크립트도 없다.**
  `.storybook/main.ts`의 glob에 매칭되는 파일이 0개라 빈 스토리북이 뜬다

### 측정 기준선 (2026-07-29, `npm run build`)

```
dist/assets/index-*.js        883.84 kB │ gzip: 340.85 kB   ← 단일 번들
dist/assets/index-*.css        32.23 kB │ gzip:   6.91 kB
dist/assets/landing-1-*.png   148.42 kB
PWA precache                  10 entries (1060.27 KiB)
```
Vite가 `Some chunks are larger than 500 kB` 경고를 낸다.

---

## P0 — 즉시 조치

### 1. 모듈 로드 시점의 무조건 API 호출 제거

`src/shared/store/student-club-store.ts:198` — 파일 최하단, 스토어 정의 직후:
```ts
useStudentClubStore.getState().fetchClubs();
```

**import 되는 순간 네트워크 요청이 나간다.** 소비처인 `header-gnb.tsx`가 RootLayout에 항상
마운트되므로 사실상 앱 시작 시 항상 실행된다 — 로그인 여부, 점검 모드, 페이지와 무관하다.
React 생명주기 밖이라 취소·재시도·에러 바운더리가 전부 적용되지 않는다.

**조치**: 최상위 호출 1줄 삭제. **소비처 수정은 불필요하다** —
`header-gnb.tsx:16-20`과 `receipt-create.tsx:200-202`가 이미
`if (authData && allClubsFlat.length === 0)`으로 가드하고 있다.
최상위 호출과 effect가 겹쳐 발생하던 중복 요청도 함께 해소된다.
근본 해결은 P2 항목 9 참조.

---

## P1 — 성능 (Lighthouse 직결)

### 2. 라우트 기반 코드 스플리팅 — 효과가 가장 큰 항목

`routers.tsx`가 17개 페이지를 전부 정적 import하고, 프로젝트 전체에 `React.lazy` / 동적 `import()`가
**0건**이다. 일반 사용자가 관리자 전용 페이지 코드까지 전부 내려받는다.

**대상**: `src/shared/routes/routers.tsx`, `src/shared/layouts/root-layout.tsx`

- `MainPage`는 첫 진입 페이지이므로 **정적 import 유지** — lazy 전환 시 청크 워터폴로 LCP가 오히려 악화된다
- `Maintenance`는 `root-layout.tsx:5`가 이미 정적으로 물고 있어 lazy로 바꿔도 번들에서 빠지지 않으므로 제외
- 나머지 14개를 `lazy()`로 전환. `Management`, `ClubTransfer`는 named export라 변환이 필요하다:
  ```tsx
  const Management = lazy(() =>
    import('@pages/admin/management').then((m) => ({ default: m.Management })),
  );
  ```
- 라우트 트리(path/children)는 그대로 두고 `element` 참조만 교체한다
- 가드 라우터는 `<Outlet/>`만 렌더하므로 개별 Suspense가 불필요하다.
  `root-layout.tsx`의 `<Outlet />` **한 곳**만 감싸면 하위 전체를 커버한다:
  ```tsx
  <Suspense fallback={<Loading />}>
    <Outlet />
  </Suspense>
  ```
  `src/pages/common/loading.tsx`가 이미 전체 화면형 로딩 컴포넌트라 그대로 재사용 가능하다.
  단 삼항 연산자 구조상 `<Outlet/>` 쪽만 감싸야 점검 화면이 불필요한 Suspense를 타지 않는다

> **주의**: Biome `organizeImports`가 import를 자동 정렬하므로
> `const X = lazy(...)` 블록은 import 구문 **아래**에 분리 배치해야 한다.

**실측 효과** (구현 후 되돌림):
```
883.84 kB → 530.66 kB   (gzip 340.85 → 174.44 kB)
```
초기 JS **40% 감소**, gzip 기준 거의 절반. 청크 41개로 분할되며
관리자/생성 페이지는 해당 라우트 진입 시에만 로드된다.

부수적으로 확인된 사실: `receipt-create`가 단독 **164.94 kB** 청크로 분리된다.
이 페이지 하나가 전체의 상당 부분을 차지하고 있었다 — P3의 거대 컴포넌트 분해 대상과 일치한다.

### 3. LCP 이미지 최적화

`src/pages/main/main-page.tsx:36` — `landing-1.png`(858×739, 148KB)가 메인 히어로에 렌더된다.
`width` / `height` / `fetchPriority`가 모두 없다.

- **(a)** `vite-plugin-image-optimizer` + `sharp`를 devDependency로 추가해 빌드 시 재압축.
  포맷 변환이 없어 컴포넌트 코드 변경이 불필요하고 리스크가 낮다.

  > **함정**: 이 플러그인은 SVG 처리를 위해 `svgo`를 **peer로 요구**하는데 자동 설치되지 않는다.
  > 없으면 빌드 중 `Cannot find package 'svgo'` 에러가 SVG마다 출력된다
  > (PNG 최적화 자체는 정상 동작). `svgo`를 함께 설치하거나 플러그인 옵션에서 SVG를 제외할 것.

  **실측 효과**: `landing-1.png` **-79%** (144.94 → 31.16 kB),
  `toss-bank.png` **-76%** (11.54 → 2.82 kB)

- **(b)** `<img>`에 `width={858} height={739} fetchPriority="high" decoding="async"` 추가.
  above-the-fold LCP 이미지이므로 `loading="lazy"`는 **붙이지 않는다**
- **(c)** 나머지 이미지 8곳에 `loading="lazy" decoding="async"`:
  `receipt-button.tsx:25`, `transfer-step4.tsx:7`, `receipt-create-sheet.tsx:35`,
  `reset-password.tsx:95`, `not-login.tsx:10`, `maintenance.tsx:14`,
  `receipts-list.tsx:81`, `tossbank-create.tsx:84`.
  `loading.tsx:6`은 Suspense fallback이므로 **제외**

### 4. 폰트 self-host

`src/shared/styles/font.css`가 SUIT 9종 + GMarketSans를 전부 jsdelivr CDN에서 로드하고,
`index.html`에 preconnect/preload가 없다.

**실사용 확인**: `theme.css` 유틸리티가 쓰는 weight는 **400/500/600/700/800 5종뿐**이다.
100(Thin) / 200(ExtraLight) / 300(Light) / 900(Heavy)은 미사용이므로 `@font-face` 4건 삭제 가능.

**GMarketSans는 유지해야 한다.** `theme.css:108-112`의 `.L_Title`이 `--font-gmarket`을 쓰고,
이 클래스가 `main-page.tsx:24` 메인 헤드카피에 적용돼 있다 — LCP 경쟁 텍스트다.
단 **629KB woff**(woff2 미제공)로 매우 무거워 **서브셋팅은 별도 이슈로 분리**할 것.

**조치**: `public/fonts/`에 6개 파일 다운로드 → `font.css` 경로를 `/fonts/...`로 변경 →
`index.html` `<head>`에 크리티컬 2종 preload:
```html
<link rel="preload" href="/fonts/SUIT-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/GmarketSansBold.woff" as="font" type="font/woff" crossorigin>
```

`public/` 배치 시 Vite가 `dist/`로 복사한다. `vite.config.ts:45`의 workbox `globPatterns`에
`woff2`는 이미 포함돼 있으나 **`woff`는 없다** — GMarketSans SW 캐싱을 위해 `woff` 추가 필요.

### 5. `staleTime` 설정으로 불필요한 refetch 제거

`src/shared/libs/query-client.ts`에 `refetchOnWindowFocus: false`와 `retry: 1`만 있다.
**`staleTime` 미설정 = 기본값 0**이므로 모든 쿼리가 마운트 즉시 stale이 되어
**컴포넌트 마운트마다 refetch**가 발생한다.

특히 `collegeQuery.collegeAndClubs()`는 거의 변하지 않는 마스터 데이터인데
`sidebar.tsx:27`, `register.tsx:80`, `management.tsx:31` **세 곳**에서 쓰여
사이드바 토글·페이지 이동마다 요청이 반복된다.

**조치**: 전역 `staleTime` 기본값 설정(예: 1분) + 마스터 데이터는 개별적으로 더 길게.
`buildQuery`(`apis/base/factory.ts:10-18`)가 이미 3번째 `options` 파라미터를 받아
스프레드하므로 별도 배관 없이 그대로 쓸 수 있다:
```ts
collegeAndClubs: () =>
  buildQuery(QK.collegeAndClubs.all(), () => collegeApi.collegesAndClubs(), {
    staleTime: 30 * 60 * 1000,
  }),
```

### 6. 전 사용자 대상 10초 폴링 완화

`src/shared/layouts/root-layout.tsx:20`
```ts
useQuery({ ...adminQueries.checkStatus(), refetchInterval: 10_000, retry: false })
```
`RootLayout`은 모든 라우트의 최상위이므로 **비로그인 방문자 포함 전 사용자**에게
`enabled` 조건 없이 세션 내내 적용된다. 사용자당 시간 360회 —
동시 접속 100명이면 점검 상태 확인만으로 10 RPS.

또한 `retry: false` + `isError → setNetworkError(true)`(`:31-37` useEffect) 조합 때문에
**일시적 네트워크 오류 한 번에 전체 앱이 점검 화면으로 전환**된다(관리자만 예외).

**조치**: 평상시 60초, 점검 중일 때만 10초.
응답 타입 `MaintenanceInfo`에는 boolean 플래그가 없고
`maintenance-store.ts:31`의 `isWithinMaintenancePeriod(startTime, expectedEndTime)`로 파생되므로,
응답을 파싱하지 말고 `root-layout.tsx:17`에서 이미 구조 분해된 `isMaintenance`를 그대로 쓴다:
```ts
refetchInterval: isMaintenance ? 10_000 : 60_000,
```
`retry: false` → `retry: 1`로 바꿔 단발 실패를 장애로 단정하지 않도록 한다.

> 폴링 주기 판단에는 `isNetworkError`가 아니라 `isMaintenance`만 써야 한다 —
> 네트워크 오류 시 주기를 당기면 장애 상황에서 요청이 증폭된다.

---

## P2 — 유지보수 기반 (재발 방지)

### 7. 서버 상태 이중 관리 해소

`src/shared/store/student-club-store.ts`(200줄)가 zustand 안에서 직접 API를 호출하며
`isLoading`/`error`/캐시를 수동 구현한다(`fetchClubs:40`, `fetchClubMembers:86`,
`addMember:110`, `deleteMember:140`).

같은 `/api/collegesAndClubs` 응답이 **zustand와 react-query 캐시에 두 벌** 존재하고
서로 동기화되지 않는다. `store/AGENTS.md:26`("서버 fetch 결과를 store에 복제 저장하지 마세요")를
정면으로 위반한다.

유사 사례:
- `user-store` vs `myQuery.getMyInfo` — `login.tsx:65-77`이 결과를 store에 복사·persist하는데
  마이페이지에서 정보를 수정해도 사본이 갱신되지 않아 재접속 시 stale 데이터가 보인다
- `maintenance-store`도 `root-layout.tsx:31-37`에서 query 결과를 useEffect로 미러링한다

**조치**: `student-club-store`의 서버 fetch를 `collegeQuery`로 일원화. 나머지 두 건도 순차 정리.

### 8. 전역 에러 처리 3계층 도입

세 계층이 모두 비어 있고, 그 공백을 20곳 이상의 복붙 `onError`와 `alert()`가 메우고 있다.

- **ErrorBoundary 0건** — `errorElement`, `componentDidCatch` 전부 없음.
  렌더 예외 시 백지 화면이 되고 react-router 기본 에러 화면이 스택 트레이스를 노출한다.
  404 catch-all(`path: '*'`)도 없다
- **`instance.ts`에 response 인터셉터 0건** — 401 자동 로그아웃, 토큰 재발급, 공통 에러 정규화가 전무하다.
  `withCredentials: true`로 쿠키 기반 refresh를 의도한 흔적은 있으나 미구현이고,
  **`refreshToken`은 `auth-store.ts:7`에 저장만 되고 어디서도 소비되지 않는다.**
  `apis/AGENTS.md:33`은 "401 시 인터셉터가 재발급 또는 로그아웃"이라 적었지만 구현이 없다
- **`query-client.ts`에 `MutationCache`/`QueryCache`의 `onError` 미설정**,
  `defaultOptions.mutations` 자체가 부재 — 이것이 `onError` 20중복의 직접 원인이다

`http.ts`의 `unwrap()`은 `.catch`가 없어 raw `AxiosError`가 컴포넌트까지 전파되고,
그 결과 각 `onError`가 에러 타입을 모른 채 고정 문자열만 alert하는 구조가 굳어졌다.

**조치 순서**: response 인터셉터(401) → `errorElement` + 404 라우트 →
`MutationCache.onError` 도입 후 중복 정리.

### 9. 인증 가드 정합성

- **토큰 만료 미검사** — 가드 4종 모두 `!!authData?.accessToken`, 즉 **문자열 존재 여부만** 본다.
  `exp` 검증은 `auth-token-watcher`의 `setTimeout`에만 의존하는데, watcher는
  `root-layout.tsx:42`에서 `{!isMaintenanceActive && <AuthTokenWatcher />}`로 **조건부 마운트**된다.
  점검 모드·네트워크 오류 시 언마운트되어 타이머가 해제되고 **만료 감시가 완전히 중단된다**
- **렌더 중 `alert()`** — `admin-router.tsx:19`, `president-router.tsx:22`가 렌더 함수 본문에서
  네이티브 `alert()`를 호출한다. StrictMode에서 두 번 뜨고 렌더를 동기 블로킹한다.
  프로젝트에 `useModal` 훅이 이미 있고 `auth-token-watcher.tsx:18,26`은 그걸 쓴다
- **인증 판정 4중 복붙** — `const isAuthenticated = !!authData?.accessToken;`가
  `protected-router.tsx:7`, `admin-router.tsx:11`, `president-router.tsx:12`, `public-router.tsx:6`에
  동일하게 존재. admin/president는 role 상수와 리다이렉트 목적지만 다르므로
  props를 받는 단일 `<RoleRouter>`로 통합 가능하다
- **JWT 디코딩 중복 구현** — `libs/token.ts:1-18`(non-ASCII 보정)과
  `auth-token-watcher.tsx:7-15`(base64 padding 보정)가 별개 구현이고 **서로의 보정이 상대에 없다**
- **토큰이 localStorage에 평문 저장** — `auth-store.ts:17,31` persist. XSS 노출면이므로 최소한 인지할 것

### 10. lint 스크립트 수정 + CI 도입

`package.json`의 `"lint:fix": "biome check . --apply"` — `--apply`는 Biome 2.x에서 **제거된 플래그**라
실행 시 즉시 에러가 난다(현재 2.2.4).

방치된 근본 원인은 **강제 장치의 부재**다. `.github/workflows/`도 husky/lint-staged도 없다.
그 결과 Biome 위반이 62건 누적됐다(포맷 46 + import 정렬 14 + 클래스 정렬 2 —
**전부 자동 수정 가능**, 실질 로직 경고는 7건뿐).

**조치**: `--apply` → `--write`, `biome check . --write`로 일괄 정리,
`tsc -b` + `biome check .`를 실행하는 최소 CI 워크플로우 추가,
`biome.json:2`의 `$schema`를 2.1.4 → 2.2.4로 동기화.

> 포맷팅 62건 일괄 수정은 diff가 매우 크므로 **로직 변경과 같은 커밋에 섞지 말 것.**

### 11. 의존성 정리

- **`react-js-pagination`** — 유령 의존성(위 Executive Summary 참조).
  HIGH 취약점(+전이 CRITICAL `tar`)을 유발한다. 제거 시 AGENTS.md 2곳도 함께 수정
- **`yarn`(^1.22.22)이 dependencies에 등록** + `package-lock.json` / `yarn.lock` **락파일 2개 공존**
  → 환경 간 의존성 드리프트 위험. 패키지 매니저를 확정하고 다른 락파일 삭제
- **`dotenv`** — Vite가 env를 자체 처리하므로 불필요
- **`tailwindcss`, `@tailwindcss/vite`, `vite-plugin-svgr`** — 빌드 도구인데 `dependencies`에 위치.
  `devDependencies`로 이동
- **ESLint/Prettier 잔해** — `eslint.config.js`, `.prettierrc.json` + eslint 관련 devDeps 6종이
  Biome과 중복 존재하나 `package.json`에 eslint 스크립트가 없다. Biome으로 일원화하고 제거
- `npm audit` 기준 **15건 취약점(critical 1, high 11)**. 대부분 `npm audit fix`로 해결되나
  프로덕션 영향이 있는 `axios` / `react-router-dom` / `vite`를 우선 처리

### 12. 죽은 코드 제거

- import 0건 파일 3개: `store/college-store.ts`(39줄, `useCollegeStore` 참조 0),
  `apis/auth/auth-queries.ts`, `apis/college/college-mutations.ts`
- `apis/base/instance.ts:23-31` — 죽은 인터셉터 주석.
  25행이 `const token = ;`로 **문법조차 깨진 초안**이고 바로 위 12행에 살아있는 구현이 있다
- `layouts/sidebar.tsx:46-53` — 주석 처리된 메뉴 재클릭 로직
- `pages/test/button-test.tsx` — 라우트에서 빠져 번들에는 안 들어가지만 파일은 남아 있다.
  삭제할지 유지할지 여기서 함께 판단할 것 ([해결 이력](#해결-이력) 참조)

### 13. 문서-코드 불일치 수정

AGENTS.md가 현재 코드와 어긋난 곳이 다수다. **문서를 믿고 작업하면 틀린다.**

| 문서 | 서술 | 실제 |
|---|---|---|
| `apis/AGENTS.md:32` | 토큰은 `@libs/token.ts`에서 읽음 | auth-store에서 읽음 |
| `apis/AGENTS.md:33` | 401 시 인터셉터가 재발급/로그아웃 | 미구현 |
| `store/AGENTS.md:16-17` | layout/sidebar 스토어 역할 | **정반대** |
| `routes/AGENTS.md:14` | 비로그인은 `/login`으로 | 현재 URL에 `<NotLogin />` 렌더 |
| `libs/AGENTS.md:13` | staleTime 정책 포함 | 미설정 |
| `components/AGENTS.md:13`, `pages/admin/AGENTS.md:24` | `react-js-pagination` 래퍼 | 완전 커스텀 구현 |

---

## P3 — 구조 개선 (별도 작업 권장)

큰 변경이라 분리한다.

- **거대 컴포넌트 분해**: `receipt-create.tsx`(634줄, useState 15 / useEffect 4 / useMutation 5),
  `register.tsx`(547줄, 이메일 인증·소속 인증·가입 3개 플로우 결합).
  커스텀 훅 분리가 필요하나 **테스트 0개라 안전망이 없다** — 테스트 도입과 함께 진행할 것.
  코드 스플리팅 실측에서 `receipt-create` 청크가 단독 164.94 kB로 나온 것이 이 부담을 뒷받침한다
- **테스트 부재**: `*.test.*` / `*.stories.*` 파일 0개(위 Executive Summary 참조).
  도구를 실제로 쓰거나(인증 로직·`receipt-create.tsx` 우선), 안 쓸 거면 제거해 혼란을 없앨 것
- **중복 로직 단일화**: 비밀번호 정책 정규식이 `register.tsx:31-35`(zod)와
  `reset-password.tsx:9-14`(수동 상수) **양쪽에 복붙**돼 정책 변경 시 한쪽만 고칠 위험.
  연도 옵션 생성이 `receipts-list.tsx:58`과 `receipt-create.tsx:116`에 문자 단위로 동일.
  `system-check.tsx:27-36`만 dayjs 대신 수동 날짜 포맷
- **쿼리키 정합성**: `key.ts:35`의 `admin.status()`가 `['auth','status']`를 반환해 네임스페이스가 오염됐다.
  invalidate가 전부 하드코딩 배열이고(`management.tsx:62,80,101,116` 등),
  `receipt-create.tsx:148`은 `QK.receipt.club(user.id)`인데 실제 쿼리는 `clubId`로 생성돼
  **무효화가 매칭되지 않을 수 있다.** queries export 이름도 복수형(`adminQueries`) / 단수형(`myQuery`)이 혼용
- **환경변수 관리**: `.env.example` 부재로 신규 셋업 시 필요 키를 알 수 없다.
  `endpoints.ts:1`의 `BASE_URL`에 fallback·검증이 없어 env 누락 시 `undefined`가 되어 상대경로로 요청이 나간다.
  현재 배포 환경 분리가 `.env` 주석 토글로 이뤄지고 있다
- **메인 히어로 CLS**: `main-page.tsx:36`의 반응형 width 클래스가 `useElementSize`의
  `useLayoutEffect` 측정에 의존해, 초기 렌더에서 `bp === 'none'`이면 width 클래스가 아예 붙지 않아
  원본 858px로 렌더된다. **`<img>`에 width/height를 추가해도 해결되지 않는** 컴포넌트 로직 문제라
  별도 PR 권장

---

## 구현 시 권장 순서와 커밋 구성

P0 + P1을 1차 작업으로, 나머지는 후속 PR로 분리하기를 권장한다.
항목별로 나눠서 커밋한다 (보안 / 스플리팅 / 이미지 / 폰트 …).

1. `fix: 모듈 로드 시점 무조건 API 호출 제거`
2. `perf: 라우트 기반 코드 스플리팅 적용`
3. `perf: LCP 이미지 최적화 및 lazy loading 적용`
4. `perf: 폰트 self-host 전환 및 미사용 weight 제거`
5. `perf: react-query staleTime 설정`
6. `perf: 점검 상태 폴링 주기 완화`

---

## 검증 절차

각 단계 후:
```bash
npm run build          # tsc -b 포함 — 타입 에러 동시 검증
npx biome check .
```

성능 측정 (변경 **전** 기준선을 먼저 기록할 것 — 위 Executive Summary 참조):
```bash
npm run build && npm run preview
npx lighthouse http://localhost:4173 --only-categories=performance --view
```

항목별 확인:

| 항목 | 확인 방법 |
|---|---|
| 최상위 호출 제거 | 로그인하지 않고 메인 진입 시 Network에 `/api/collegesAndClubs`가 **뜨지 않는지**. 로그인 후에는 1회 요청되는지 |
| 스플리팅 | `ls -la dist/assets/*.js` — 단일 883KB에서 다수 청크로 분할됐는지. DevTools Network에서 일반 사용자가 admin 청크를 받지 않는지 |
| 이미지 | `ls -la dist/assets/landing-1*` 크기 비교 |
| 폰트 | `grep -c jsdelivr dist/assets/*.css`가 **0**인지, Network 요청이 same-origin `/fonts/...`인지. SUIT weight가 5개만 요청되는지. `.L_Title` 렌더가 깨지지 않는지 |
| staleTime | 사이드바 토글·페이지 이동을 반복해도 `collegesAndClubs` 요청이 재발생하지 않는지 |
| 폴링 | Network에서 `checkStatus`가 60초 간격인지. 점검 모드 진입 시 10초로 짧아지는지 |

**LCP 재확인**: 이미지 최적화 후 LCP 요소가 이미지에서 헤드라인 텍스트로 바뀔 수 있으므로
DevTools Performance 패널에서 재측정할 것.

---

## 해결 이력

### 평문 비밀번호·학번 콘솔 출력 — `d357324` (2026-07-29)

`register.tsx`의 `console.log('회원가입 데이터:', data)`가 `RegisterFormValues` 전체를 찍어
**비밀번호·비밀번호 확인·이메일·학번이 프로덕션 콘솔에 그대로 노출**됐다.
이 1건과 `club-transfer.tsx`의 학번·응답·에러 로그 4건을 함께 제거했다.

2026-08-05 전수 확인 결과 남은 `console.*` 6건은 전부 `console.error`(에러 객체만 출력)이거나
라우팅에서 빠진 `button-test.tsx`라 **민감정보 노출은 없다.**

> **재발 방지는 미조치** — `biome.json`에 `suspicious.noConsole`(`allow: ["error"]`) 룰이 없어
> 린트가 같은 실수를 잡지 못한다. `button-test.tsx`가 걸리므로 P2 항목 12 이후 도입이 깔끔하고,
> P2 항목 8의 전역 에러 처리가 들어오면 개별 `console.error`도 대체된다.

### 테스트 전용 라우트 노출 — `b765caf` (2026-07-29)

`routers.tsx`의 `ButtonTestPage` import와 `test/buttons` 라우트를 주석 처리해
인증 가드 밖에 노출되던 테스트 페이지를 없앴다. `/test/buttons` 접근 시 더 이상 렌더되지 않는다.
페이지 파일 자체는 남아 있으므로 삭제 여부는 P2 항목 12에서 함께 판단할 것.
