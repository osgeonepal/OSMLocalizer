import json

error_messages = json.load(open("backend/errors.json"))


class BaseException(Exception):
    # This will contain the error message, the status code and sub code
    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv["message"] = self.message
        return rv, self.status_code


class NotFound(BaseException):
    def __init__(self, sub_code, message=None):
        sub_code = sub_code if sub_code else "NOT_FOUND"
        if message is None:
            message = error_messages[sub_code]
        payload = {"sub_code": sub_code}
        BaseException.__init__(self, message, 404, payload)


class Unauthorized(BaseException):
    def __init__(self, sub_code, message=None):
        sub_code = sub_code if sub_code else "UNAUTHORIZED"
        if message is None:
            message = error_messages[sub_code]
        payload = {"sub_code": sub_code}
        BaseException.__init__(self, message, 401, payload)


class BadRequest(BaseException):
    def __init__(self, sub_code, message=None):
        sub_code = sub_code if sub_code else "BAD_REQUEST"
        if message is None:
            message = error_messages[sub_code]
        payload = {"sub_code": sub_code}
        BaseException.__init__(self, message, 400, payload)


class Conflict(BaseException):
    def __init__(self, sub_code, message=None):
        sub_code = sub_code if sub_code else "CONFLICT"
        if message is None:
            message = error_messages[sub_code]
        payload = {"sub_code": sub_code}
        BaseException.__init__(self, message, 409, payload)


class InternalServerError(BaseException):
    def __init__(self, sub_code, message=None):
        sub_code = sub_code if sub_code else "INTERNAL_SERVER_ERROR"
        if message is None:
            message = error_messages[sub_code]
        payload = {"sub_code": sub_code}
        BaseException.__init__(self, message, 500, payload)


class Forbidden(BaseException):
    def __init__(self, sub_code, message=None):
        sub_code = sub_code if sub_code else "FORBIDDEN"
        if message is None:
            message = error_messages[sub_code]
        payload = {"sub_code": sub_code}
        BaseException.__init__(self, message, 403, payload)


class Unauthorized(BaseException):
    def __init__(self, sub_code, message=None):
        sub_code = sub_code if sub_code else "UNAUTHORIZED"
        if message is None:
            message = error_messages[sub_code]
        payload = {"sub_code": sub_code}
        BaseException.__init__(self, message, 401, payload)
