# syntax=docker/dockerfile:1
FROM gixx/worst-practice:latest
WORKDIR /app

CMD tail -f /dev/null

EXPOSE 4000/tcp
