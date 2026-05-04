from typing import Annotated, Sequence, TypedDict, Union
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from app.config import settings
from app.tools.enterprise_tools import tools

from langgraph.graph.message import add_messages

# Define the state shape
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]

# Initialize LLM with tools
llm = ChatGoogleGenerativeAI(
    model=settings.GEMINI_MODEL,
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0
).bind_tools(tools)

# Define the nodes
def call_model(state: AgentState):
    messages = state['messages']
    print(f"DEBUG: Calling LLM with {len(messages)} messages")
    for m in messages:
        print(f"  - {type(m).__name__}: {m.content[:50]}...")
        if hasattr(m, 'tool_calls'): print(f"    Tool Calls: {m.tool_calls}")
    response = llm.invoke(messages)
    return {"messages": [response]}

def should_continue(state: AgentState):
    messages = state['messages']
    last_message = messages[-1]
    if last_message.tool_calls:
        return "tools"
    return END

# Build the graph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode(tools))

# Set entry point
workflow.set_entry_point("agent")

# Add edges
workflow.add_conditional_edges(
    "agent",
    should_continue,
)
workflow.add_edge("tools", "agent")

# Compile the graph
agent_app = workflow.compile()

def run_agent(user_input: str, chat_history: list = None):
    initial_messages = []
    if chat_history:
        for msg in chat_history:
            if msg['role'] == 'user':
                initial_messages.append(HumanMessage(content=msg['content']))
            else:
                initial_messages.append(AIMessage(content=msg['content']))
    
    initial_messages.append(HumanMessage(content=user_input))
    
    inputs = {"messages": initial_messages}
    result = agent_app.invoke(inputs)
    
    # Get the final AI response
    final_message = result['messages'][-1]
    
    # Check for tool calls in the conversation to show in UI
    agent_actions = []
    for msg in result['messages']:
        if isinstance(msg, AIMessage) and msg.tool_calls:
            for tc in msg.tool_calls:
                agent_actions.append({
                    "tool": tc['name'],
                    "args": tc['args']
                })
                
    return {
        "content": final_message.content,
        "actions": agent_actions
    }
