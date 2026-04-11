from rest_framework.pagination import PageNumberPagination


class OptionalPageNumberPagination(PageNumberPagination):
    """
    Backward-compatible pagination.

    Why:
    - Existing clients currently expect plain array responses.
    - We only paginate when caller explicitly requests `page` or `page_size`.
    """

    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        should_paginate = (
            request.query_params.get("page") is not None
            or request.query_params.get("page_size") is not None
        )

        if not should_paginate:
            return None

        return super().paginate_queryset(queryset, request, view)