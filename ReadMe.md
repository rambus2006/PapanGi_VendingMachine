# 파판기 (PapanGi) - 파이썬 기반으로 구현된 객체지향 자판기 시뮬레이션 프로젝트

Python + Vending Machine Project
파이썬 기반으로 구현된 객체지향 자판기 시뮬레이션 프로젝트입니다.
사용자의 입력 흐름을 중심으로 음료 선택, 결제, 재고 관리 기능을 구조적으로 설계하여 실제 자판기 동작을 소프트웨어적으로 구현했습니다.

```
venv\Scripts\activate

uvicorn src.main:app --reload
```
## 목차
1. 프로젝트 소개 
- [프로젝트 개요](#프로젝트-개요)
- [핵심 기능](#핵심-기능)
- [시스템 아키텍처](#시스템-아키텍처)
- [디렉터리 가이드](#디렉터리-가이드)
- [기술 스택](#기술-스택)
2. 기능 구현 
- [선행 요구 사항](#선행-요구-사항)
- [환경 변수 템플릿](#환경-변수-템플릿)
- [로컬 실행 절차](#로컬-실행-절차)
- [Docker 배포](#docker-배포)
3. api 연결 
- [운영 체크리스트](#운영-체크리스트)
- [테스트와 품질 확인](#테스트와-품질-확인)
4. git 사용 과정 
- [깃사용전략]

## 프로젝트 개요
- 파판기(PapanGi)는 Python을 활용하여 개발된 자판기 시스템으로,
사용자 경험 흐름을 단순한 CLI 또는 GUI 환경에서 직관적으로 구현한 학습용 프로젝트입니다.

- 객체지향 설계를 기반으로 음료 데이터 관리, 주문 처리, 재고 관리 로직을 분리하여
유지보수성과 확장성을 고려한 구조로 설계했습니다.

## 핵심 기능 



## 시스템 아키텍처

- React SPA가 Nginx 경유로 Spring Boot API(`/api/**`)를 호출하고, 인증 토큰/리포트 데이터를 주고받습니다.
- Spring Boot는 MySQL과 Redis로 상태를 관리하며, LiveKit Room & Agent Dispatch, 이메일, AWS S3, Python Agent와 연동합니다.
- LiveKit Agent는 LiveKit Room에 Participant로 접속하여 오디오를 수집/믹싱하고, S3 · OpenAI · Deepgram · Spring으로로 데이터를 전송합니다.
- docker-compose는 `backend` + `nginx` + `certbot`를 묶어 배포하며, 외부 Docker 네트워크(Jenkins/Portainer/Monitoring)에 프록시를 연결할 수 있습니다.

```
사용자
  │
  ▼
Tkinter View
  │
  ▼
Controller
  │
  ▼
Model
  │
  ▼
MySQL
```

## 디렉터리 가이드

```
vending_machine_project/
├── src/
│   └── vending_machine/
│       ├── __init__.py
│       ├── main.py                    # 프로그램 시작
│       │
│       ├── models/                    # 데이터 및 DB 처리
│       │   ├── __init__.py
│       │   ├── db.py                  # MySQL 연결
│       │   ├── drink_model.py         # 음료 데이터 모델
│       │   └── admin_model.py         # 관리자 데이터 모델
│       │
│       ├── views/                     # Tkinter GUI 화면
│       │   ├── __init__.py
│       │   ├── main_view.py           # 메인 자판기 화면
│       │   ├── payment_view.py        # 결제 화면
│       │   └── admin_view.py          # 관리자 화면
│       │
│       ├── controllers/               # 로직 제어
│       │   ├── __init__.py
│       │   ├── vending_controller.py  # 구매/재고 처리
│       │   ├── payment_controller.py  # 결제 처리
│       │   └── admin_controller.py    # 관리자 기능 처리
│       │
│       └── utils/
│           ├── __init__.py
│           └── validator.py           # 입력값 검증
│
├── requirements.txt
└── README.md
 
```

## db 테이블 구조 
- 테이블은 1개만 사용하여 제작했습니다.
| 컬럼명 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 음료 고유 번호 |
| name | VARCHAR(50) | NOT NULL | 음료 이름 |
| price | INT | NOT NULL | 음료 가격 |
| stock | INT | NOT NULL | 음료 재고 수량 |
| image_path | VARCHAR(255) |  | 음료 이미지 경로 |
| is_soldout | BOOLEAN | DEFAULT FALSE | 품절 여부 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 생성 시간 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 수정 시간 |
  

주요 서브 모듈

- `backend/src/main/java/com/ssafy/meethub/auth|meeting|report|user|common`: 인증, 회의, 보고서, 파일시스템, 공통 모듈
- `backend/src/main/resources/templates/email`: 공유/인증 메일 템플릿(Thymeleaf)
- `frontend/src/api|components|hooks|pages|store|types`: Axios API 모듈, 페이지별 컴포넌트, 커스텀 훅, Zustand 스토어, 타입 정의
- `livekit_agent/agent.py|models.py|database.py`: MeetingAgent 구현, SQLite 모델, 비동기 DB 큐
- `nginx/Dockerfile`: certbot와 연동되는 리버스 프록시 이미지 정의

## MVC 
### Models

### View

### Controllers
| 파일                 | 역할       |
| ------------------ | -------- |
| vending_controller | 구매/재고 판단 |
| payment_controller | 금액 처리    |
| admin_controller   | 상품 관리    |



## 기술 스택

| 영역        | 주요 기술                                                                                                                                                         |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 프론트엔드  | React 19, TypeScript, Vite 7, Tailwind CSS, @livekit/components, Zustand, React Router v7, Swiper, Datadog RUM                                                    |
| 백엔드      | Spring Boot 3.5, Java 21, Spring Security, Spring Data JPA, Redis, MySQL, JWT, LiveKit Server SDK, Retrofit/OkHttp, Micrometer, Springdoc Swagger, Thymeleaf Mail |
| AI/에이전트 | Python 3.10, livekit-agents, livekit-plugins-deepgram, livekit-plugins-openai, Deepgram STT, OpenAI API, httpx, boto3, aiosqlite                                  |
| 인프라/배포 | Docker, docker-compose, Nginx, Certbot, AWS S3, LiveKit Cloud/Server, Prometheus, Gmail SMTP                                                                      |

## 선행 요구 사항

- Java 21 및 Gradle Wrapper(프로젝트 동봉)
- Node.js 20+ / npm 10+
- Python 3.10
- MySQL 8.0
- Redis 7.x
- LiveKit 서버(Cloud 또는 자가 호스팅)와 API Key/Secret

## 로컬 실행 절차

1. **저장소 준비**

   - `git clone` 후 `S13P31S103` 디렉터리로 이동합니다.
   - MySQL에 빈 데이터베이스를 만들고 `.env`에 입력합니다.
   - Redis와 LiveKit 서버, AWS S3 버킷이 접근 가능한지 확인합니다.

2. **백엔드**

   ```
   cd backend
   ./gradlew clean bootRun
   ```

   - 서버는 `http://localhost:8088/api`에서 동작하며 Swagger UI는 `/api/docs`입니다.

3. **프론트엔드**

   ```
   cd frontend
   npm install
   npm run dev -- --host 0.0.0.0 --port 5173
   ```

   - `.env`의 `VITE_SERVER_URL`을 백엔드 주소로 맞춘 뒤 브라우저에서 `http://localhost:5173` 접속합니다.

4. **LiveKit Agent**

   ```
   cd livekit_agent
   python -m venv .venv
   source .venv/bin/activate  # Windows는 .venv\Scripts\activate
   pip install -r requirement.txt
   python main.py dev
   ```

   - LiveKit Agent Worker가 실행 중이어야 회의 생성 시 자동으로 참여합니다.

5. **(선택) Docker로 백엔드 실행**
   ```
   docker compose up -d backend
   ```
   - 로컬 개발 시 nginx/certbot은 필요하지 않습니다.

## 운영 체크리스트

- `GET /api/docs` : Springdoc Swagger (JWT 인증 필요 시 Authorization 헤더 설정)
- `GET /api/actuator/health`, `/api/actuator/info`, `/api/actuator/prometheus` : 헬스/지표 확인
- 애플리케이션 로그 : 컨테이너 기준 `/app/logs/application.log`
- 이메일 : Gmail SMTP 사용, 2단계 인증 + 앱 패스워드 필수
- Datadog RUM : 프론트 빌드 결과에 `VITE_DD_*` 값이 주입되어야 세션이 수집됩니다.
- S3 : `video-recording/{roomId}` 경로로 세그먼트/playlist가 업로드되는지 확인합니다.
- LiveKit Agent : `monitor.sh`, `deploy.sh` 스크립트를 활용해 Worker 재시작/배포를 자동화할 수 있습니다.

## 테스트와 품질 확인

- 백엔드 단위/통합 테스트
  ```
  cd backend
  ./gradlew test
  ./gradlew checkstyleMain checkstyleTest
  ```
- 프론트엔드 정적 검사
  ```
  cd frontend
  npm run lint
  npm run build
  ```
- 에이전트(선택)
  - `python -m compileall .` 로 문법 오류를 확인하거나 `ruff`, `mypy` 등 사내 기준에 맞춘 툴을 추가할 수 있습니다.
- Pull Request 전 체크리스트
  - Swagger에서 주요 API 동작 확인
  - 회의 생성 → 에이전트 자동 투입 → 회의 종료 후 리포트 생성까지 통합 시나리오 점검
  - 공유/권한 변경, 이메일 발송, Datadog RUM 세션, Actuator 지표를 최소 1회 확인

---
# 4. 깃사용과정 
## 4-1. 깃 전략 
- **Feat** : 새로운 기능 추가
- **Fix** : 버그 수정
- **Docs** : 문서 수정
- **Test** : 테스트 코드 추가
- **Refactor** : 코드 리팩토링
- **Style** : 코드 의미에 영향을 주지 않는 변경사항
- **Chore** : 빌드 부분 혹은 패키지 매니저 수정사항
## 4-2. 깃 도구 사용 
- gitlens
- github 



---
# 실행 명령어 
```
특정 DB 바로 접속:

mysql -u root -p vending_machineDB

들어가서 자주 쓰는 명령어:

SHOW DATABASES;   -- DB 목록
USE vending_machineDB; -- DB 선택
SHOW TABLES;      -- 테이블 목록
EXIT;             -- 종료
FastAPI 실행

프로젝트 폴더에서:
uvicorn main:app --reload
```
# 해야할 일

> 해야할 일 (미완 )
- 보고서 작성 
- git으로 작업 내용 공유 
- 음료 사진 - 포기해도 됨
- 칠성 사이다에는 사진 넣기 
- 파일 구조 정리 


> 해결됨 
- 토스트 창 만들기 -> 해결 
- 자판기 라우터 오류 -> 해결 
- 자판기 css 파일 통일-> 해결
- swagger 문서 작성 -> 해결(8000/docs 치면 나옴 )
- 카드 부분 삭제 및 자판기 ui 수정 -> 해결 

> 문제 발생 
