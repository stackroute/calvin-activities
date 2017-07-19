FROM mhart/alpine-node-auto

RUN mkdir -p /app/capacity-test
RUN mkdir -p /app/lib

WORKDIR /app/lib
COPY lib .

WORKDIR /app/capacity-test

COPY capacity-test-data/package.json .
RUN npm install

COPY capacity-test-data .

CMD ["npm", "start", "--production"]
