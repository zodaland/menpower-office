FROM node:gallium-alpine

ENV TZ asia/seoul
ENV HOME /home/node

RUN apk add tzdata

WORKDIR /home/node
CMD yarn create next-app --typescript && yarn dev
#COPY ./package.json /home/node
#COPY ./yarn.lock /home/node
#CMD yarn && yarn run dev

