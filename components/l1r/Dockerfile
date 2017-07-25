FROM mhart/alpine-node-auto

RUN mkdir -p /app/l1r
RUN mkdir -p /app/lib
WORKDIR /app/lib

COPY lib .

WORKDIR /app/l1r
COPY l1r/package.json .

RUN npm install

COPY l1r .

CMD ["npm", "start", "--production"]
