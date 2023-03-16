import datetime
import re

# Based on https://stackoverflow.com/a/51916936
duration_regex = re.compile(
    r"^((?P<days>[\.\d]+?)d)?((?P<hours>[\.\d]+?)h)?((?P<minutes>[\.\d]+?)m)?((?P<seconds>[\.\d]+?)s)?$"
)


def timestamp():
    """Return current UTC time"""
    return datetime.datetime.utcnow()


def to_strftime(date):
    """Convert date to string"""
    return date.strftime("%Y-%m-%d %H:%M:%S")


def to_strfdate(date):
    """Convert date to string"""
    return date.strftime("%Y-%m-%d")


def get_last_updated(last_updated):
    diff = datetime.datetime.utcnow() - last_updated
    if diff.days > 0:
        return f"{diff.days} days ago"
    elif diff.seconds > 3600:
        return f"{diff.seconds // 3600} hours ago"
    elif diff.seconds > 60:
        return f"{diff.seconds // 60} minutes ago"
    else:
        return f"{diff.seconds} seconds ago"


def parse_duration(time_str):
    """
    Parse a duration string e.g. (2h13m) into a timedelta object.
    :param time_str: A string identifying a duration.  (eg. 2h13m)
    :return datetime.timedelta: A datetime.timedelta object
    """
    parts = duration_regex.match(time_str)
    assert parts is not None, "Could not parse duration from '{}'".format(time_str)
    time_params = {
        name: float(param) for name, param in parts.groupdict().items() if param
    }
    return datetime.timedelta(**time_params)
