from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env file from project root
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RadioRequest(BaseModel):
    driverName: str
    situation: str

class RadioResponse(BaseModel):
    exchange: str

@app.post("/api/generate-radio", response_model=RadioResponse)
async def generate_radio(request: RadioRequest):
    if not request.driverName or not request.driverName.strip():
        raise HTTPException(status_code=400, detail="Driver name is required")
    
    if not request.situation or not request.situation.strip():
        raise HTTPException(status_code=400, detail="Situation is required")
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not found")
    
    client = OpenAI(api_key=api_key)
    
    prompt = f"""Generate a realistic, short Formula 1 driver-engineer radio exchange.

Driver: {request.driverName.strip()}
Situation: {request.situation.strip()}

Create a brief, authentic radio dialogue between the driver and their race engineer. The exchange should:
- Be realistic and match F1 radio communication style
- Show the driver's personality and the engineer's professional response
- Be concise (2-4 exchanges total, maximum 6)
- Include appropriate F1 terminology and race context
- Match the urgency and tone appropriate to the situation

Format the response exactly as:
Driver: [message]
Engineer: [message]
Driver: [message]
Engineer: [message]

Keep it short, authentic, and engaging."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert at creating authentic Formula 1 radio communications. Generate realistic, engaging driver-engineer dialogues that match real F1 radio style, terminology, and personality."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.8,
            max_tokens=500
        )
        
        radio_exchange = response.choices[0].message.content.strip()
        return RadioResponse(exchange=radio_exchange)
    
    except Exception as e:
        import traceback
        error_detail = str(e)
        print(f"Error generating radio: {error_detail}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate radio exchange: {error_detail}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

