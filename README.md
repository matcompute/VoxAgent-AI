# VoxAgent AI 🤖💼

**The Next-Generation Agentic Customer Service Platform**

VoxAgent is not just another chatbot. It is a fully autonomous **Agentic System** designed for high-stakes industries like Banking, Telecom, and E-commerce. Built with **LangGraph**, it possesses the ability to reason, execute business logic through tool-calling, and manage complex multi-turn customer workflows with ease.

## 🚀 Key Features

*   **Autonomous Reasoning:** Uses a directed acyclic graph (DAG) via **LangGraph** to manage agent state, allowing for complex loops, retries, and multi-step decision making.
*   **Enterprise Tool Integration:** Equipped with a robust toolset to interact with mock backend systems:
    *   🏦 **Banking:** Real-time account balance verification.
    *   📊 **Telecom:** Automated billing statement retrieval and analysis.
    *   💳 **Financial:** Automated refund processing with conditional logic.
    *   🆘 **Escalation:** Intelligent sentiment-aware escalation to human supervisors.
*   **Zero-Hallucination Grounding:** Tools are strictly defined, ensuring the AI only provides information verified by the enterprise backend.
*   **Premium "Cyber-Slate" UI:** A modern, dark-mode React interface featuring glassmorphism, real-time "Agent Thinking" indicators, and quick-action toolbars.

## 🛠️ Technology Stack

*   **Orchestration:** LangGraph (Stateful Agentic Workflows)
*   **LLM:** Google Gemini (`gemini-2.5-flash` for high-speed, multi-tool reasoning)
*   **Backend:** Python 3.10+, FastAPI, Pydantic v2
*   **Frontend:** React 18, TypeScript, Vite, Lucide-Icons
*   **Networking:** Axios with standard CORS configurations

## ⚙️ Installation & Setup

### 1. Backend Setup
1. Navigate to `/backend`.
2. Create and activate a virtual environment.
3. Install dependencies: `pip install -r requirements.txt`
4. Add your `GEMINI_API_KEY` to the `.env` file.
5. Start the API:
   ```bash
   python -m uvicorn app.main:app --port 8003 --reload
   ```

### 2. Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`
3. Start the UI:
   ```bash
   npm run dev
   ```
4. Access the portal at `http://localhost:5173`.

## 📈 Why VoxAgent?
In the modern enterprise, "Chat" is the interface, but "Agents" are the execution engine. VoxAgent demonstrates a production-ready pattern for building AI that doesn't just talk, but **works**.
