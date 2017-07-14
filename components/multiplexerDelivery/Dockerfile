FROM mhart/alpine-node-auto

RUN mkdir -p /app2
WORKDIR /app2

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start", "--production"]
