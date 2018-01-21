FROM node:4-onbuild

ENV TZ=Europe/Helsinki

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir /src

RUN npm install nodemon -g

WORKDIR /src

ADD howlong.js /src/howlong.js

ADD package.json /src/package.json

RUN npm install

#ADD app/nodemon.json /src/nodemon.json

EXPOSE 8080

CMD npm start
