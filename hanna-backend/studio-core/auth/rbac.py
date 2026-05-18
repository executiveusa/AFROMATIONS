from storage.models import UserRole

ROLE_HIERARCHY: dict[UserRole, int] = {
    UserRole.user: 0,
    UserRole.creator: 1,
    UserRole.admin: 2,
}


def has_permission(user_role: UserRole, required_role: UserRole) -> bool:
    return ROLE_HIERARCHY.get(user_role, -1) >= ROLE_HIERARCHY.get(required_role, 999)
