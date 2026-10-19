# 배포 및 PHASE 8 유지 관리

웹사이트: https://mirorun.github.io/-/  
저장소: https://github.com/Mirorun/-

## 배포

GitHub Pages는 `main` 브랜치의 루트(`/`)를 게시합니다. `.nojekyll`로 정적 파일을 그대로 제공합니다. 별도 빌드나 VS Code 실행이 필요하지 않습니다. 변경한 실행 파일을 커밋하고 main으로 푸시하면 Pages가 다시 배포합니다. `_deploy8` 인증 파일·백업·검수 결과와 `_phase*`는 Git에 추가하지 않습니다.

`node scripts/build-pages.mjs`는 필요할 때 실행 파일만 `_site`에 모으는 별도 준비 도구입니다. 현재 Pages는 `_site`가 아니라 main 루트를 사용합니다. 초기 준비한 Actions 워크플로는 사용하지 않으며 저장소에 푸시하지 않았습니다.

## 음악 데이터

- `js/music/jpop-data.js`: 새 17곡, 아티스트 모음, 4개 플레이리스트. 원본 `js/music/data.js`와 `js/data.js`는 그대로 보존합니다.
- `rows`의 각 행: `[id, 곡명, 아티스트, 앨범, 공식 YouTube 영상 ID, 플레이리스트 ID 배열, 발표 연도]`.
- 곡 ID는 고유해야 합니다. 같은 아티스트 모음을 사용하려면 `eve-`, `natori-`, `kenshi-`, `chiikawa-`, `vaundy-` 접두사를 사용합니다. 새로운 아티스트를 만들면 `jpopAlbums`에도 해당 접두사 ID를 추가합니다.
- 예: `['eve-new','곡명','Eve','앨범명','확인한11자리ID',['often','night'],2027]`. 실제로 확인한 공식 영상 ID만 입력합니다. 2028-07-03 이후 발매 음악은 추가하지 않습니다.
- `jpopPlaylists`에서 제목·설명·커버 경로를 바꿉니다. `playlistIds`로 소속을 설정합니다.
- `duration: null`인 곡은 재생 길이를 확인하지 않은 항목입니다. 임의 길이로 표시하지 않습니다.
- 치이카와 「ひとりごつ」는 확인된 NexTone 공식 배포 페이지로 연결합니다. 일반 YouTube 링크는 `youtubeUrl`, 배포 페이지는 `officialUrl`을 사용합니다. 새 도메인 허용은 `js/music/view.js`의 `officialLink()`에서 검토합니다.
- `assets/music/*.svg`는 이 프로젝트에서 직접 제작한 플레이리스트 커버입니다. 음원, 공식 앨범 이미지 또는 동영상 파일은 포함하지 않습니다.
- 곡 선택 시 공식 페이지를 새 탭으로 열고 곡 화면을 표시합니다. 외부 페이지의 재생 여부는 앱이 제어하지 않습니다. 최근 재생은 공식 페이지를 연 곡의 세션 기록이며 새로고침하면 비워집니다.

## 공식 링크 확인 근거

2026-10-20에 YouTube oEmbed의 제목·게시자·채널 URL을 확인했습니다. 검수용 원본 응답 요약은 `_deploy8/official-link-verification.json` 및 `official-extra-links.json`에 있습니다. 잘못된 후보 ID `bFQUYsAJMqw`는 확인 과정에서 404였으며 앱에는 넣지 않았습니다. 「猿芝居」는 확인된 `bjYG08Cdix4`를 사용합니다.

- Eve 공식: https://eveofficial.com/news/20200130200059.html — 心予報의 공식 영상 링크
- Eve 공식: https://eveofficial.com/news/20230120180002.html — ぼくらの 발매
- 米津玄師 공식: https://reissuerecords.net/kickback/ — 공식 MV 연결
- なとり 공식 채널: https://www.youtube.com/@Siritoriyowai_
- 치이카와 공식: https://www.anime-chiikawa.jp/ — ひとりごつ, ハチワレ（CV.田中誠人） 확인
- ひとりごつ 공식 배포: https://nex-tone.link/A00100543 — 곡명 및 공식 서비스 연결 확인
- Pony Canyon 공식: https://news.ponycanyon.co.jp/2024/02/95307 — パジャマパーティーズのうた 발매 및 배포 링크
- Vaundy 공식 영상: https://www.youtube.com/watch?v=lYLa6zyjhSI — LIVE 버전으로 명시

## 효과음

- 기존 `js/phone/audio.js`의 `PhoneAudio`를 재사용합니다. 발신 연결음, 수신 반복 벨소리, 연결 성공, 종료/실패음은 기존 상태 전환과 연결되어 있습니다. 새 기능은 음량 인자만 추가합니다.
- `js/audio/effects.js`에서 문자·카카오톡별로 직접 합성한 짧은 패턴 및 버튼 피드백을 정의합니다. 서비스 공식 녹음 음원을 복제하지 않습니다.
- `js/main.js`의 알림 `arrival` 경로에서만 재생하며, 같은 이벤트 ID는 한 번만 처리합니다. 읽음·무음 이벤트는 울리지 않습니다. 수신 중/발신 연결 중 전화 소리가 우선합니다. 연속 수신은 간격을 두고 최대 대기 폭을 제한합니다.
- 첫 터치/키 입력 전에는 브라우저 정책에 따라 소리가 나지 않을 수 있습니다. 과거 알림음을 나중에 몰아서 재생하지 않습니다. 오디오 API가 없거나 재생이 허용되지 않아도 메시지·통화 UI는 계속 동작합니다.
- 사용자 상태는 메모리에서만 유지하며 영구 저장하지 않습니다. 기존 메시지·카카오톡 원문·시간·ID·초안·연락처·통화 기록·음성사서함은 변경하지 않았습니다.

## 추가 및 수정 파일

기존 변경: `index.html`, `js/main.js`, `js/music/view.js`, `js/phone/audio.js`.

추가: `js/audio/effects.js`, `js/music/jpop-data.js`, `css/music-phase8.css`, `assets/music/often.svg`, `night.svg`, `practice.svg`, `liked.svg`, 본 문서.

배포 준비 추가: `.gitignore`, `.gitattributes`, `.nojekyll`, `scripts/build-pages.mjs`. 로컬 `_deploy8`에 수정 전 실행 파일 ZIP 백업, 해시 목록, 테스트 스크립트·결과·스크린샷이 있습니다. 인증 관련 파일은 배포 대상이 아닙니다.

## 검증 범위와 한계

Chrome에서 PC·모바일 크기를 검증합니다. 실제 iPhone Safari 및 사람이 듣고 판단하는 음색/음량은 별도 확인이 필요합니다. YouTube 영상은 지역·계정 정책에 따라 재생 제한이 있을 수 있으며 외부 재생 성공을 보장하거나 앱 내부 재생으로 표시하지 않습니다. 실제 전화망·실제 푸시·음성 합성은 구현하지 않습니다. PHASE 6·7의 신규 콘텐츠는 제작하지 않았습니다.
