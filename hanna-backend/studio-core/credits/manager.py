from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from storage.models import CreditTransaction, User

TOOL_COSTS: dict[str, float] = {
    "generate_image": 2.0,
    "generate_video": 10.0,
    "generate_voice": 1.5,
    "lip_sync_character": 5.0,
    "compose_scene": 1.0,
    "render_video": 3.0,
    "estimate_cost": 0.0,
    "queue_job": 0.0,
    "get_status": 0.0,
}


def get_tool_cost(tool_name: str) -> float:
    return TOOL_COSTS.get(tool_name, 1.0)


def estimate_dag_cost(tool_names: list[str]) -> float:
    return sum(get_tool_cost(t) for t in tool_names)


async def get_balance(user_id: str, db: AsyncSession) -> float:
    result = await db.execute(select(User.credits).where(User.id == user_id))
    balance = result.scalar_one_or_none()
    return float(balance or 0.0)


async def check_credits(user_id: str, required: float, db: AsyncSession) -> bool:
    balance = await get_balance(user_id, db)
    return balance >= required


async def deduct_credits(
    user_id: str,
    amount: float,
    description: str,
    db: AsyncSession,
    job_id: str | None = None,
) -> float:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise ValueError(f"User {user_id} not found")
    if user.credits < amount:
        raise ValueError(
            f"Insufficient credits: need {amount:.2f}, have {user.credits:.2f}"
        )

    user.credits -= amount
    new_balance = user.credits

    tx = CreditTransaction(
        user_id=user_id,
        job_id=job_id,
        amount=-amount,
        description=description,
        balance_after=new_balance,
    )
    db.add(tx)
    await db.commit()
    return new_balance


async def add_credits(
    user_id: str,
    amount: float,
    description: str,
    db: AsyncSession,
) -> float:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise ValueError(f"User {user_id} not found")

    user.credits += amount
    new_balance = user.credits

    tx = CreditTransaction(
        user_id=user_id,
        amount=amount,
        description=description,
        balance_after=new_balance,
    )
    db.add(tx)
    await db.commit()
    return new_balance
