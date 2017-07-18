FROM mhart/alpine-node-auto

RUN mkdir -p /app/routes-manager
RUN mkdir -p /app/lib
WORKDIR /app/lib
COPY lib .
WORKDIR /app/routes-manager
COPY routesManager/package.json .

RUN npm install

COPY routesManager .

CMD ["npm", "start", "--production"]
