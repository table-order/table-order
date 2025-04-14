# 프로젝트명 : Table-order

**Git 명령어 정리**

1. 새로운 브랜치 생성

```bash
git checkout -b feature/이름
```

2. feature 브랜치 작업 완료 후

```bash
git fetch upstream                # upstream의 최신 변경사항 가져오기
git rebase upstream/develop       # upstream/develop의 변경사항을 현재 브랜치에 rebase
pnpm i                            # 의존성 패키지 설치 (필요한 경우)
git push origin feature/이름      # 내 원격레포지토리에 push
```

3. PR을 GitHub에서 생성하고 팀에 리뷰 요청 보내기

4. PR 병합 후 develop 브랜치를 최신 상태로 유지

```bash
git checkout develop
git fetch upstream
git rebase upstream/develop

```

**1 → 2 → 3 순서로 작업을 반복합니다.**
