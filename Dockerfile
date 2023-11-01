#базовый образ
FROM node:21.1.0-bookworm-slim 

#каталог внутри контейнера и устанавливает права доступа к этому каталогу для пользователя node.
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

#устанавливает руководящую директорию
WORKDIR /home/node/app

#копирует файлы package из контекста сборки в текущую рабочую директорию
COPY package*.json ./

#переключает пользователя внутри контейнера
USER node

#устанавливает зависимости Node.js,
RUN npm install

#копирует файлы и каталоги из контекста сборки в текущую рабочую директорию
COPY --chown=node:node . .

#объявляет порт
EXPOSE 8080

#задаёт команду которая запустит приложения Node.js
CMD [ "node", "app.js" ]


