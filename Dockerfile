FROM library/nginx:latest
MAINTAINER Pixel <support@pixel-networks.com>

ENV API_CORE http://postgraphile:5000
ENV MEDIASERVER http://mediaserver:3000

COPY build/ /usr/share/nginx/pixel-board/html
COPY site.conf /etc/nginx/conf.d/default.conf
COPY site.conf /etc/nginx/conf.d/pixel-board.conf
