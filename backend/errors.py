class ApplicationError(Exception):
    detail: str
    status_code: int
    def __init__(self, detail: str, status_code: int):
        super().__init__(detail)
        self.detail = detail
        self.status_code = status_code


class NotFoundError(ApplicationError):
    def __init__(self, detail: str):
        super().__init__(detail, 404)


class ConflictError(ApplicationError):
    def __init__(self, detail: str):
        super().__init__(detail, 409)


class UnauthorizedError(ApplicationError):
    def __init__(self, detail: str = "Требуется вход в аккаунт"):
        super().__init__(detail, 401)


class ForbiddenError(ApplicationError):
    def __init__(self, detail: str = "Недостаточно прав"):
        super().__init__(detail, 403)


class RefreshRequiredError(UnauthorizedError):
    code = "access_refresh_required"

    def __init__(self):
        super().__init__("Необходимо обновить access token")
