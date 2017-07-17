FROM mhart/alpine-node-auto

RUN mkdir -p /app/multiplexer
RUN mkdir -p /app/lib

WORKDIR /app/lib

COPY ./lib .

WORKDIR /app/multiplexer

COPY ./multiplexer .

RUN npm install

COPY . .

CMD ["npm", "start", "--production"]
