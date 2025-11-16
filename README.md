# F1 Radio Generator

Generate realistic Formula 1 driver-engineer radio exchanges using AI. Enter a driver name and situation, and get an authentic radio dialogue.

## Features

- **Realistic Radio Exchanges**: AI-generated dialogues that match F1 radio style
- **Driver Personalities**: Responses tailored to specific drivers
- **Various Situations**: Handle different race scenarios (tyre issues, overtakes, safety cars, etc.)
- **Authentic Terminology**: Uses proper F1 terminology and communication style

## Prerequisites

- Python 3.8+
- Node.js 18+
- OpenAI API key

## Setup

### 1. Python Backend Setup

```bash
# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Ensure .env file exists with your OpenAI API key
# OPENAI_API_KEY=your_api_key_here
```

### 2. Next.js Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## Running the Application

### Start Python Backend

```bash
# Activate virtual environment
source venv/bin/activate

# Run server
cd backend
python app.py
```

Backend runs on `http://localhost:8000`

### Start Next.js Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

## Usage

1. Enter a driver name (e.g., "Lewis Hamilton", "Max Verstappen")
2. Enter a situation (e.g., "tyres overheating", "safety car restart", "final lap battle")
3. Click "Generate Radio Exchange"
4. View the generated driver-engineer dialogue

## Project Structure

```
f1-radio-generator/
├── backend/
│   └── app.py              # FastAPI backend
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Main UI
│   │   └── globals.css
│   └── package.json
├── requirements.txt        # Python dependencies
├── .env                    # OpenAI API key
└── README.md

```

