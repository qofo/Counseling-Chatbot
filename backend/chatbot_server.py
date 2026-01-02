import os
import shutil
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import PromptTemplate 
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_core.output_parsers import StrOutputParser

# 환경 변수 로드
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = FastAPI(title="Aespa Love Consultant API (King-receiving Ver. 2.0)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. 모델 및 DB 설정
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
llm = ChatOpenAI(temperature=0.7, model_name="gpt-4o") # 창의적인 드립을 위해 temperature를 약간 높임 (0 -> 0.7)

def prepare_aespa_system():
    data_dir = "./data"
    member_files = {
        "카리나": "karina_wiki.txt",
        "윈터": "winter_wiki.txt",
        "닝닝": "ningning_wiki.txt",
        "지젤": "giselle_wiki.txt"
    }
    
    all_chunks = []
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)

    for kor_name, file_name in member_files.items():
        file_path = os.path.join(data_dir, file_name)
        if os.path.exists(file_path):
            loader = TextLoader(file_path, encoding='utf-8')
            docs = loader.load()
            for doc in docs:
                doc.metadata["member_name"] = kor_name
            chunks = text_splitter.split_documents(docs)
            all_chunks.extend(chunks)

    if os.path.exists("./chroma_db"):
        shutil.rmtree("./chroma_db")

    vectorstore = Chroma.from_documents(
        documents=all_chunks,
        embedding=embeddings,
        persist_directory="./chroma_db",
        collection_name="aespa_db"
    )
    return vectorstore

vector_db = prepare_aespa_system()

# 2. 분류 체인
classify_prompt = PromptTemplate.from_template("""
사용자의 질문을 분석해서 다음 네 명 중 누구에 대한 질문인지 한 단어로만 답해: [카리나, 윈터, 닝닝, 지젤]
질문에 이름이 직접 없더라도 맥락상 누구인지 판단해. 만약 판단이 불가능하면 '전체'라고 답해.

질문: {question}
멤버이름:""")
classifier_chain = classify_prompt | llm | StrOutputParser()

# 3. 메인 답변 프롬프트 (수정됨: 번호 삭제, 자연스러운 흐름, 반복 멘트 금지)
main_prompt = PromptTemplate.from_template("""
야, 너 진짜 진심으로 **{target_member}**님을 넘보는 거임? 🙄 ㅋㅋ 양심 어디감?

너는 지금부터 사용자의 연애 고민을 아주 하찮게 여기는 '에스파 전문 팩폭러'이자 '찐친'이야.
니 역할은 사용자가 주제 파악을 하도록 **'킹받게(약오르지만 반박할 수 없게)'** 팩트를 꽂아주는 거야.

[절대 지침 - 이것만은 지켜]
1. **형식**: (1), (2), (3) 같은 **번호 매기기 절대 금지**. 그냥 친구랑 카톡하듯이 줄글로 자연스럽게 이어가.
2. **반복 금지**: "님이랑 먹을 일 없음" 같은 똑같은 멘트를 문장마다 붙이지 마. 앵무새냐? 문맥에 맞춰서 다양하게 비꼬아줘.
   - (좋은 예: "꿈 깨라", "거울은 보고 다니냐?", "이번 생은 글렀음", "상상 연애 그만해라")
3. **데이터 활용**: 반드시 아래 [Context]에 있는 **{target_member}**의 정보만 사용해. 
   - 정보가 없으면 "아 몰라, 그런 건 데이터에도 없어. 님 망상 그만해 🤷‍♀️"라고 받아쳐.
4. **말투**: 
   - 반말 필수. 최신 인터넷 은어, MZ 말투, 이모지(🙄, 🤦‍♂️, 🤷‍♀️, ㅋ, ;;)를 적극 사용해.
   - 설명조("~라고 합니다") 금지. 대화체("~라는데?", "~란다 ㅋㅋ") 사용.

[답변 가이드]
- 먼저 어이없다는 듯이 한번 웃어주고 시작해.
- [Context]의 내용을 자연스럽게 섞어서 말해. (번호 붙이지 말고 연결어 사용: "그리고", "참고로", "아 맞다")
- 마지막엔 정신 차리라고 한 방 먹이고 끝내.

[Context] (여기 있는 내용만 써)
{context}

[Question]
{question}

[Answer]
""")

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # 1. 질문을 분석해 어떤 멤버인지 확정
        target_member = classifier_chain.invoke({"question": request.question}).strip()
        
        # 2. 필터 적용하여 해당 멤버 데이터만 추출
        search_kwargs = {"k": 6}
        if target_member in ["카리나", "윈터", "닝닝", "지젤"]:
            search_kwargs["filter"] = {"member_name": target_member}
        
        # 3. 검색 수행
        retriever = vector_db.as_retriever(search_type="mmr", search_kwargs=search_kwargs)
        context_docs = retriever.invoke(request.question)
        context_text = "\n\n".join([doc.page_content for doc in context_docs])

        # 4. 답변 생성
        chain = main_prompt | llm
        response = chain.invoke({
            "target_member": target_member,
            "context": context_text,
            "question": request.question
        })
        
        return ChatResponse(answer=response.content)
    
    except Exception as e:
        return ChatResponse(answer=f"아 서버 터짐;; 님 얼굴 보고 놀란 듯 ㅡㅡ 에러: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)