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
def escalate_to_human(reason: str) -> str:
    """Escalates the conversation to a human representative when the AI cannot resolve the issue."""
    return f"Conversation escalated to a human expert. Reason: {reason}. A representative will be with you shortly."

tools = [check_account_balance, get_billing_statement, process_refund, escalate_to_human]
