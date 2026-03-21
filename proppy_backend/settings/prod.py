from .base import *

DEBUG = False
ALLOWED_HOSTS = ['your-production-domain.com']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'proppy_prod',
        'USER': 'proppy_user',
        'PASSWORD': 'your-password',
        'HOST': 'your-prod-db-host',
        'PORT': '5432',
    }
}

CORS_ALLOWED_ORIGINS = [
    'https://your-frontend-domain.com',
]

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {"min_length": 8},
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]
