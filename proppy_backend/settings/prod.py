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
