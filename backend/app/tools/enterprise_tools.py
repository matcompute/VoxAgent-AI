from langchain_core.tools import tool
import random

@tool
def check_account_balance(user_id: str) -> str:
    """Checks the user's current bank account balance."""
    # Mock data
    balances = {
        "user_123": "$4,250.60",
        "user_999": "$0.00",
        "test_user": "$1,000,000.00"
    }
    return f"The balance for user {user_id} is {balances.get(user_id, '$150.00')}."

@tool
def get_billing_statement(user_id: str, month: str) -> str:
    """Retrieves the billing statement for a specific month (e.g., 'January', 'February')."""
    amount = random.randint(50, 200)
    return f"The billing statement for user {user_id} in {month} is ${amount}.50. Status: PAID."

@tool
def process_refund(transaction_id: str, reason: str) -> str:
    """Processes a refund request for a specific transaction ID."""
    if "error" in transaction_id.lower():
        return f"Error: Transaction {transaction_id} not found."
    return f"Refund for transaction {transaction_id} successfully initiated. Reason: {reason}. Status: PENDING APPROVAL."

@tool
def check_data_usage(user_id: str) -> str:
    """Checks the user's mobile data usage (e.g., '15GB used of 20GB')."""
    usage = random.randint(1, 20)
    limit = 20
    return f"User {user_id} has used {usage}GB of their {limit}GB monthly data limit."

@tool
def change_roaming_plan(user_id: str, country: str, plan_type: str = "Standard") -> str:
    """Activates an international roaming data plan for a specific country."""
    return f"International Roaming ({plan_type}) has been successfully activated for user {user_id} in {country}. Effective immediately."

@tool
def resolve_technical_issue(issue_type: str) -> str:
    """Provides automated troubleshooting steps for common technical issues like 'No Network' or 'App Crashing'."""
    if "network" in issue_type.lower():
        return "Steps sent to user: 1. Toggle Airplane Mode, 2. Reset Network Settings, 3. Check for local outage in Pisa."
    return f"Automated diagnostics initiated for '{issue_type}'. Connection reset sent to the device."

@tool
def escalate_to_human(reason: str) -> str:
    """Escalates the conversation to a human representative when the AI cannot resolve the issue."""
    return f"Conversation escalated to a human expert. Reason: {reason}. A representative will be with you shortly."

tools = [
    check_account_balance, 
    get_billing_statement, 
    process_refund, 
    check_data_usage, 
    change_roaming_plan, 
    resolve_technical_issue, 
    escalate_to_human
]
