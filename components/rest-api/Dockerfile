FROM mhart/alpine-node-auto

RUN mkdir -p /app/rest-api
WORKDIR /app/rest-api
RUN mkdir -p /app/lib
WORKDIR /app/lib
COPY lib .
COPY rest-api/package.json .
RUN npm install
COPY rest-api .

CMD ["npm", "start", "--production"]
