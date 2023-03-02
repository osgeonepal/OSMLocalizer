from datetime import datetime


def timestamp():
    """Return current UTC time"""
    return datetime.utcnow()


def to_strftime(date):
    """Convert date to string"""
    return date.strftime("%Y-%m-%d %H:%M:%S")

def to_strfdate(date):
    """Convert date to string"""
    return date.strftime("%Y-%m-%d")


def get_last_updated(last_updated):
    diff = datetime.utcnow() - last_updated
    if diff.days > 0:
        return f"{diff.days} days ago"
    elif diff.seconds > 3600:
        return f"{diff.seconds // 3600} hours ago"
    elif diff.seconds > 60:
        return f"{diff.seconds // 60} minutes ago"
    else:
        return f"{diff.seconds} seconds ago"
