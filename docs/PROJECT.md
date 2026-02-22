# ToMyongJi 프론트엔드 — 프로젝트 구조 및 사용법

이 문서는 ToMyongJi-front-TS 저장소의 디렉터리 구조, 기술 스택, 명령어, 개발 가이드를 정리한 것입니다.

---

## 1. 프로젝트 구조

```
ToMyongJi-front-TS/
├── .github/                    # GitHub 템플릿
│   ├── ISSUE_TEMPLATE/         # 이슈 템플릿 (버그, 기능 제안, 일반)
│   └── PULL_REQUEST_TEMPLATE.md
├── .storybook/                 # Storybook 설정
├── docs/                       # 프로젝트 문서 (본 문서 등)
├── public/                     # 정적 파일
├── src/
│   ├── main.tsx                # 앱 진입점
│   ├── App.tsx                 # QueryClient + Router 루트
│   ├── vite-env.d.ts
│   ├── pages/                  # 페이지 컴포넌트 (라우트 단위)
│   │   └── main/
│   │       └── main-page.tsx
│   └── shared/                 # 공용 모듈
│       ├── apis/               # API 클라이언트
│       │   ├── base/           # axios 인스턴스, HttpClient, factory
│       │   ├── auth/           # 인증 API·뮤테이션
│       │   └── constants/      # endpoints, statuscode
│       ├── assets/             # 이미지, 아이콘 등
│       ├── components/         # 공용 UI 컴포넌트
│       ├── constants/          # 앱 상수
│       ├── contexts/           # React Context
│       ├── hooks/              # 공용 훅
│       ├── layouts/            # 레이아웃 (RootLayout 등)
│       ├── libs/               # 유틸 라이브러리 (cn, query-client)
│       ├── mocks/              # 목 데이터
│       ├── routes/            # 라우터 정의 (routers.tsx)
│       ├── styles/             # 전역 스타일 (Tailwind, theme, font)
│       ├── types/              # 공용 타입
│       └── utils/              # 유틸 함수
├── index.html
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json
├── biome.json                  # 포맷터·린터 (Biome)
├── eslint.config.js
├── commitlint.config.mjs       # 커밋 메시지 규칙
└── package.json
```

---

## 2. 기술 스택

| 구분 | 기술 |
|------|------|
| 런타임/빌드 | Node, Vite 7 |
| UI | React 19, TypeScript |
| 스타일 | Tailwind CSS 4 |
| 라우팅 | React Router v7 |
| 데이터/상태 | TanStack React Query, Zustand |
| HTTP | Axios |
| PWA | vite-plugin-pwa |
| SVG | vite-plugin-svgr |
| 코드 품질 | Biome (포맷·린트), ESLint |
| 컴포넌트 문서/테스트 | Storybook 9, Vitest, Playwright |

---

## 3. Path alias (import)

`tsconfig.json`과 Vite `vite-tsconfig-paths`로 아래 별칭을 사용할 수 있습니다.

| 별칭 | 경로 |
|------|------|
| `@styles/*` | `src/shared/styles/*` |
| `@routes/*` | `src/shared/routes/*` |
| `@mocks/*` | `src/shared/mocks/*` |
| `@libs/*` | `src/shared/libs/*` |
| `@layouts/*` | `src/shared/layouts/*` |
| `@hooks/*` | `src/shared/hooks/*` |
| `@constants/*` | `src/shared/constants/*` |
| `@utils/*` | `src/shared/utils/*` |
| `@apis/*` | `src/shared/apis/*` |
| `@assets/*` | `src/shared/assets/*` |
| `@components/*` | `src/shared/components/*` |
| `@types/*` | `src/shared/types/*` |
| `@contexts/*` | `src/shared/contexts/*` |
| `@pages/*` | `src/pages/*` |

예: `import { cn } from '@libs/cn';`, `import MainPage from '@pages/main/main-page';`

---

## 4. 사용법

### 4.1 설치

```bash
yarn install
```

### 4.2 환경 변수

프로젝트 루트에 `.env` 파일을 두고 다음 변수를 설정합니다.

```env
VITE_API_BASE_URL=https://your-api-server.com
```

- API 기본 URL은 `@apis/constants/endpoints.ts`의 `BASE_URL`에서 사용됩니다.

### 4.3 개발 서버

```bash
yarn dev
```

- Vite 개발 서버가 실행되며 HMR이 적용됩니다.

### 4.4 빌드

```bash
yarn build
```

- `tsc -b`로 타입 체크 후 `vite build`로 번들을 생성합니다.
- 결과물은 `dist/`에 출력됩니다.

### 4.5 미리보기 (배포 빌드 로컬 확인)

```bash
yarn preview
```

### 4.6 린트 / 포맷 (Biome)

```bash
yarn lint        # 검사만
yarn lint:fix    # 자동 수정 적용
yarn format      # 포맷 적용
```

- Biome이 포맷·린트를 담당하며, `clsx`/`cn` 등 클래스명 정렬 규칙이 있습니다.

### 4.7 Storybook

```bash
yarn storybook
```

- `http://localhost:6006`에서 실행됩니다.
- 스토리 파일: `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`, `*.mdx`
- addon: Docs, Onboarding, a11y, Vitest, Chromatic

스토리북 정적 빌드:

```bash
yarn build-storybook
```

---

## 5. 주요 개발 가이드

### 5.1 라우트 추가

1. `src/pages/` 아래에 페이지 컴포넌트를 추가합니다 (예: `src/pages/about/about-page.tsx`).
2. `src/shared/routes/routers.tsx`에서 `createBrowserRouter`의 `children`에 경로를 추가합니다.

```tsx
import AboutPage from '@pages/about/about-page';

// children 배열에 추가
{ path: 'about', element: <AboutPage /> }
```

- 루트 레이아웃은 `RootLayout`(`@layouts/root-layout`)에서 `<Outlet />`으로 자식 라우트가 렌더됩니다.

### 5.2 API 추가

1. **엔드포인트**: `src/shared/apis/constants/endpoints.ts`에 URL 상수를 추가합니다.
2. **HTTP 호출**: `src/shared/apis/base/`의 `axiosInstance`와 `HttpClient`를 사용합니다.
   - 새 도메인(예: `receipt`)이면 `src/shared/apis/` 아래에 `receipt/` 폴더를 만들고, `http.get`/`http.post` 등으로 호출하는 함수를 두면 됩니다.
3. **React Query**: `@apis/base/factory.ts`의 `buildQuery`, `buildMutation`, `buildInfiniteQuery`로 옵션 객체를 만들고, 페이지/훅에서 `useQuery`/`useMutation`/`useInfiniteQuery`에 넘겨 사용합니다.
   - 예시는 `src/shared/apis/auth/auth-mutations.ts`를 참고합니다.

### 5.3 스타일 (Tailwind + cn)

- 전역 스타일: `src/shared/styles/` (index.css, theme.css, font.css 등).
- 클래스 병합: `import { cn } from '@libs/cn';` 사용 (Biome에서 `cn`/`clsx` 클래스 정렬 규칙 적용).

### 5.4 커밋 메시지 (Commitlint)

다음 타입과 규칙을 따릅니다.

- **타입**: `feat`, `fix`, `chore`, `style`, `hotfix`, `design`, `comment`, `remove`, `rename`, `docs`, `refactor`, `test`, `init`, `build`
- **예**: `feat: 로그인 API 연동`, `fix: 메인 페이지 레이아웃 깨짐`
- 제목 길이 100자 제한.

---

## 6. PWA

- `vite-plugin-pwa`로 서비스 워커·매니페스트가 설정되어 있습니다.
- 앱 이름: ToMyongJi, 테마 색: `#87AAFF`, 아이콘: `/mainicon.svg` 기준입니다.
- `registerType: 'autoUpdate'`로 빌드 배포 시 자동 갱신됩니다.

---

## 7. 참고

- 이슈/PR은 `.github/` 아래 템플릿을 사용합니다.
- ESLint 설정은 `eslint.config.js`에서 확인할 수 있습니다.
