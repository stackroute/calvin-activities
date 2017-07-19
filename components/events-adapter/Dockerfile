FROM mhart/alpine-node-auto

RUN mkdir -p /app/events-adapter
RUN mkdir -p /app/lib
WORKDIR /app/lib

COPY lib .

WORKDIR /app/events-adapter
COPY events-adapter/package.json .

RUN npm install

COPY events-adapter .

CMD ["npm", "start", "--production"]
