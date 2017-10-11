FROM mhart/alpine-node-auto:8.5
MAINTAINER himanisingla8708@gmail.com

RUN mkdir -p /app/l1r
RUN mkdir -p /app/lib
WORKDIR /app/lib

COPY lib .

WORKDIR /app/l1r
COPY l1r/package.json .

RUN npm install

COPY l1r .

CMD ["npm", "start", "--production"]
