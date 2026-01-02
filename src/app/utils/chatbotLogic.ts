export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// API 설정 - Python 서버 주소를 여기서 변경하세요
const API_BASE_URL = 'http://localhost:8000';

const INITIAL_MESSAGE = `또 뭔데? 이상한 말 할거면 가`;

/**
 * Python API 서버에 메시지를 전송하고 응답을 받아옵니다
 */
export async function generateBotResponse(userMessage: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: userMessage
      }),
    });

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    const data = await response.json();
    return data || '응답을 받지 못했습니다.';
  } catch (error) {
    console.error('API 호출 오류:', error);
    
    // API 서버 연결 실패 시 안내 메시지
    return `이건 좀 이상한데...  다시 한번 시도해봐`;
  }
}

export function getInitialMessage(): string {
  return INITIAL_MESSAGE;
}
