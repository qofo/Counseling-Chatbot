# FLY AI 8기 챗봇 시스템

SKT FLY AI 8기 2팀 demo 연애 상담 챗봇 시스템 (React Frontend + Python Backend)

## 프로젝트 구조

```
├── backend/                 # Python Flask 백엔드
│   ├── chatbot_server.py   # Flask 서버 메인 파일
│   ├── requirements.txt    # Python 패키지 목록
│   ├── .env.example        # 환경변수 예시
│   └── README.md           # 백엔드 설명서
│
└── src/                    # React 프론트엔드
    ├── app/
    │   ├── App.tsx        # 메인 앱 컴포넌트
    │   ├── components/
    │   │   ├── ChatMessage.tsx    # 메시지 컴포넌트
    │   │   └── ChatInput.tsx      # 입력 컴포넌트
    │   └── utils/
    │       └── chatbotLogic.ts    # API 호출 로직
    └── styles/
```

## 실행 방법

### 1. Python 백엔드 서버 실행

**터미널 1:**
```bash
# 가상환경 생성 및 활성화 (최초 1회)
cd backend
python3 -m venv venv
source venv/bin/activate    # Mac/Linux
# 또는
venv\Scripts\activate       # Windows

# 패키지 설치 (최초 1회)
pip install -r requirements.txt

# 서버 실행
python app.py
```

서버가 `http://localhost:8000`에서 실행됩니다.

### 2. React 프론트엔드 실행

**터미널 2:**
```bash
# 프로젝트 루트 디렉토리에서
npm install    # 최초 1회
npm run dev
```

브라우저에서 표시되는 주소(보통 `http://localhost:5173`)로 접속하세요.

