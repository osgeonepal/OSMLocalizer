import json
from werkzeug.exceptions import HTTPException

error_messages = json.load(open("backend/errors.json"))


class BaseException(HTTPException):
    def __init__(self, message, status, sub_code):
        self.sub_code = sub_code
        self.message = message
        self.status = status
        response = self.to_dict()
        HTTPException.__init__(self, message, response)

    def to_dict(self):
        return {
            "message": self.message,
            "status": self.status,
            "sub_code": self.sub_code,
        }, self.status


class NotFound(BaseException):
    def __init__(self, sub_code=None, message=None):
        sub_code = sub_code if sub_code else "NOT_FOUND"
        if message is None:
            message = error_messages[sub_code]
        BaseException.__init__(self, message, 404, sub_code)


class Unauthorized(BaseException):
    def __init__(self, sub_code=None, message=None):
        sub_code = sub_code if sub_code else "UNAUTHORIZED"
        if message is None:
            message = error_messages[sub_code]
        BaseException.__init__(self, message, 401, sub_code)


class BadRequest(BaseException):
    def __init__(self, sub_code=None, message=None):
        sub_code = sub_code if sub_code else "BAD_REQUEST"
        if message is None:
            message = error_messages[sub_code]
        BaseException.__init__(self, message, 400, sub_code)


class Conflict(BaseException):
    def __init__(self, sub_code=None, message=None):
        sub_code = sub_code if sub_code else "CONFLICT"
        if message is None:
            message = error_messages[sub_code]
        BaseException.__init__(self, message, 409, sub_code)


class InternalServerError(BaseException):
    def __init__(self, sub_code=None, message=None):
        sub_code = sub_code if sub_code else "INTERNAL_SERVER_ERROR"
        if message is None:
            message = error_messages[sub_code]
        BaseException.__init__(self, message, 500, sub_code)


class Forbidden(BaseException):
    def __init__(self, sub_code=None, message=None):
        sub_code = sub_code if sub_code else "FORBIDDEN"
        if message is None:
            message = error_messages[sub_code]
        BaseException.__init__(self, message, 403, sub_code)


class Unauthorized(BaseException):
    def __init__(self, sub_code=None, message=None):
        sub_code = sub_code if sub_code else "UNAUTHORIZED"
        if message is None:
            message = error_messages[sub_code]
        BaseException.__init__(self, message, 401, sub_code)
