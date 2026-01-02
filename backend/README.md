# FLY AI 7기 챗봇 - Python Backend

SK텔레콤 FLY AI 7기 교육생을 위한 챗봇 백엔드 서버 (Flask)

## 설치 및 실행 방법

### 1. 가상환경 생성 및 활성화

**Mac/Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

### 2. 패키지 설치

```bash
pip install -r requirements.txt
```

### 3. 서버 실행

```bash
python app.py
```

서버가 `http://localhost:5000`에서 실행됩니다.

### 4. 프론트엔드 연결

프론트엔드는 자동으로 `http://localhost:5000/api/chat` 엔드포인트에 연결됩니다.

다른 주소/포트를 사용하는 경우, `/src/app/utils/chatbotLogic.ts` 파일의 `API_BASE_URL` 값을 수정하세요.

## API 엔드포인트

### POST /api/chat

**요청:**
```json
{
  "message": "교육 언제 시작해?",
  "timestamp": "2025-12-31T10:30:00.000Z"
}
```

**응답:**
```json
{
  "response": "챗봇 응답 내용",
  "timestamp": "2025-12-31T10:30:01.234Z"
}
```

## 환경 설정

필요한 경우 `.env` 파일을 생성하여 환경변수를 설정할 수 있습니다:

```
FLASK_ENV=development
PORT=5000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 문제 해결

### CORS 오류
- `app.py`의 `CORS` 설정에서 프론트엔드 주소를 추가하세요

### 포트 충돌
- `app.py`의 `port` 값을 변경하고, 프론트엔드의 `API_BASE_URL`도 함께 변경하세요
