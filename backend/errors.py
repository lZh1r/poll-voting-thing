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
