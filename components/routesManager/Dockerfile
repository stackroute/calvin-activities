FROM mhart/alpine-node-auto:8.5
MAINTAINER himanisingla8708@gmail.com

RUN mkdir -p /app/routes-manager
RUN mkdir -p /app/lib
WORKDIR /app/lib
COPY lib .
WORKDIR /app/routes-manager
COPY routesManager/package.json .

RUN npm install

COPY routesManager .

CMD ["npm", "start", "--production"]
