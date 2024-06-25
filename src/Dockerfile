# Определить базовый образ.
FROM node:14

# Определить рабочую директорию в контейнере Docker.
WORKDIR /usr/src/app

# Копировать package.json и package-lock.json
COPY package*.json ./

# Установить все зависимости.
RUN npm install

# Копировать остальные файлы проекта.
COPY . .

# Открыть порт, который используется приложением (в случае Video-Group-Meeting, это порт 4001).
EXPOSE 4001

# Определить команду, которую Docker будет запускать при старте контейнера.
CMD [ "npm", "start" ]