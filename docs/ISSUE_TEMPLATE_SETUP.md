# 이슈 템플릿이 GitHub에서 안 보일 때

## 원인

GitHub는 **저장소의 기본 브랜치(default branch)** 에 있는 `.github/ISSUE_TEMPLATE/` 만 사용합니다.

- 로컬 현재 브랜치가 `dev`이고, GitHub 기본 브랜치가 `main`이면 → **이슈 템플릿이 적용되지 않습니다.**
- 템플릿을 수정한 브랜치를 푸시만 하고, 기본 브랜치에는 머지하지 않은 경우에도 동일합니다.

## 해결 방법

### 1) main에 템플릿 반영하기 (기본 브랜치가 main인 경우)

```bash
# main으로 이동
git checkout main

# dev의 .github 변경 사항만 가져오기 (또는 dev를 main에 머지)
git checkout dev -- .github/

# 커밋 후 푸시
git add .github/
git commit -m "chore: 이슈/PR 템플릿 추가"
git push origin main
```

이후 GitHub에서 **New issue**를 누르면 템플릿 선택 화면이 나타납니다.

### 2) GitHub 기본 브랜치를 dev로 바꾸기

기본 브랜치를 `dev`로 쓰는 경우:

1. GitHub 저장소 → **Settings** → **General**
2. **Default branch**에서 `main` → `dev`로 변경 후 **Update** 선택

이미 `dev`에 `.github/`를 푸시했다면, 기본 브랜치만 바꿔도 템플릿이 적용됩니다.

## 확인 방법

- GitHub 저장소 **기본 브랜치**에서 아래 경로에 파일이 있는지 확인:
  - `.github/ISSUE_TEMPLATE/config.yml`
  - `.github/ISSUE_TEMPLATE/bug_report.md`
  - `.github/ISSUE_TEMPLATE/feature_request.md`
  - `.github/ISSUE_TEMPLATE/default.md`
- **마크다운(.md) 템플릿**은 frontmatter에 반드시 **`about:`** 키가 있어야 합니다. `description:`은 이슈 폼(.yml)용이라 사용하면 드롭다운에 안 뜹니다.
- **New issue** 클릭 시 "Open a blank issue" 옆에 **템플릿 선택 드롭다운**이 보이면 정상 적용된 것입니다.
