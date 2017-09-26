FROM mhart/alpine-node-auto:8.5
MAINTAINER himanisingla8708@gmail.com

RUN mkdir -p /app/events-processor
RUN mkdir -p /app/lib
WORKDIR /app/lib
COPY lib .
WORKDIR /app/events-processor
COPY event_processor/package.json .

RUN npm install

COPY event_processor .

CMD ["npm", "start", "--production"]
