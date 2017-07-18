FROM mhart/alpine-node-auto

RUN mkdir -p /app/multiplexer
RUN mkdir -p /app/lib
WORKDIR /app/lib
COPY lib .
WORKDIR /app/multiplexer
COPY multiplexer/package.json .

RUN npm install

COPY multiplexer .

CMD ["npm", "start", "--production"]
