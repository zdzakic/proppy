
from .base import *
from datetime import timedelta

DEBUG = True
ALLOWED_HOSTS = []

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

CORS_ALLOW_ALL_ORIGINS = True

#token
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=60),   # token traje 30 dana
    "REFRESH_TOKEN_LIFETIME": timedelta(days=90),  # refresh traje 60 dana
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
}