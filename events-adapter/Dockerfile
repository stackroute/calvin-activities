FROM mhart/alpine-node-auto

RUN mkdir -p /app/events-adapter

WORKDIR /app/events-adapter
COPY events-adapter/package.json .

RUN npm install

COPY events-adapter .

CMD ["npm", "start", "--production"]
