import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { QuickChips } from './components/QuickChips';
import { AdviceIntensitySlider } from './components/AdviceIntensitySlider';
import { generateBotResponse, getInitialMessage, Message } from './utils/chatbotLogic';
import { MessageCircle, Minimize2, X } from 'lucide-react';
const conversationHistory = [];

function addConversationHistory(data: { question: string; answer: string }) {
  conversationHistory.push(
    { question: data.question, answer: data.answer }
  );
}

function buildConversationString(newQuestion) {
  let conversationString = '';
  
  // 저장된 모든 대화를 순회하면서 포맷팅
  for (let i = 0; i < conversationHistory.length; i++) {
    conversationString += `user: ${conversationHistory[i].question}\n`;
    conversationString += `AI: ${conversationHistory[i].answer}\n`;
  }
  
  // 새로운 질문 추가
  conversationString += `user: ${newQuestion}`;
  
  return conversationString;
}


export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [intensity, setIntensity] = useState(70); // Default: 매운맛
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    // Add initial welcome message
    const initialMessage: Message = {
      id: Date.now().toString(),
      text: getInitialMessage(),
      isBot: true,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Show loading state
    setIsLoading(true);

    try {
      // Call Python API
      const conversationString = buildConversationString(text);
      const botResponseText = await generateBotResponse(conversationString);

      // Save to conversation history
      addConversationHistory({ question: text, answer: botResponseText });
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText.answer,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('응답 생성 오류:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '이건 좀 이상한데요... 다시 한번 시도해보세요.',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickChipClick = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <div className="min-h-screen bg-[#2a2a2a] flex items-center justify-center p-4">
      <div className="w-[800px] h-[95vh] flex gap-4 mx-auto">
        {/* Main Chat Container */}
        <div className="flex-1 bg-[#1a1a1a] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#3a3a3a]">
          {/* Header */}
          <div className="bg-[#2a2a2a] border-b border-[#3a3a3a] px-6 py-4 flex items-center gap-3">
            <div className="relative">
              <div className="bg-[#ff5555] rounded-full p-2.5">
                <MessageCircle size={24} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#ff5555] rounded-full w-3 h-3 animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-[#f5f5f5] flex items-center gap-2">
                네가 답답해 죽겠는 연애 상담 AI
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                모솔은 당신의 탓입니다
              </p>
            </div>
            
            
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#1a1a1a]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle size={64} className="text-[#3a3a3a] mb-4" />
                <p className="text-[#f5f5f5] text-lg font-semibold mb-2">
                  아직 대화 없음
                </p>
                <p className="text-gray-400">시작할래?</p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.text}
                    isBot={message.isBot}
                    timestamp={message.timestamp}
                  />
                ))}
                
                {/* Loading indicator in chat */}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-[#3a3a3a] rounded-2xl px-4 py-3 flex items-center gap-2 border-l-4 border-[#ff5555]">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[#ff5555] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-[#ff5555] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-[#ff5555] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm text-[#f5f5f5] ml-2">AI는 현재 분석중...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <ChatInput onSend={handleSendMessage} />
        </div>

        

        {/* Mobile Bottom Drawer */}
        {showSidebar && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowSidebar(false)}>
            <div 
              className="w-full bg-[#2a2a2a] rounded-t-2xl p-6 animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-[#4a4a4a] rounded-full mx-auto mb-4"></div>
              <h2 className="text-lg font-bold text-[#f5f5f5] mb-4">설정</h2>
              <AdviceIntensitySlider 
                intensity={intensity} 
                onChange={setIntensity} 
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #ff5555;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #ff5555;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
