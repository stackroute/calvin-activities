FROM mhart/alpine-node-auto:8.5
MAINTAINER himanisingla8708@gmail.com

RUN mkdir -p /app/multiplexer-delivery
RUN mkdir -p /app/lib
WORKDIR /app/lib
COPY lib .
WORKDIR /app/multiplexer-delivery

COPY multiplexer-delivery/package.json .

RUN npm install

COPY multiplexer-delivery .

CMD ["npm", "start", "--production"]
