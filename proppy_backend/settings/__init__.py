import os

ENV = os.getenv("DJANGO_ENV") or "dev"

if ENV == "prod":
    from .prod import *
else:
    from .dev import *
