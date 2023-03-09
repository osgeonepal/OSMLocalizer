FROM python:3.10 as base

FROM base as builder

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    python3-dev

WORKDIR /install

COPY pyproject.toml  pdm.lock ./

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir pdm==2.4.8 \
    && pdm config python.use_venv false
RUN pdm install --prod --no-editable

FROM base
WORKDIR /usr/src/app

ENV PATH="/usr/src/python/bin:$PATH" \
    PYTHONPATH="/usr/src/python/lib"

COPY --from=builder \
    /install/__pypackages__/3.10 \
    /usr/src/python

COPY backend backend/
COPY migrations migrations/
COPY wsgi.py ./

CMD ["gunicorn", "-c", "python:backend.gunicorn", "wsgi:app"]
