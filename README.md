# Job Tapper

Job Tapper - это интерактивное приложение для автоматической отправки откликов на вакансии в форме увлекательной игры. Пользователи должны быстро нажимать на появляющиеся элементы, чтобы отправлять отклики через API HeadHunter.

## Структура проекта

Проект состоит из двух основных частей:

1. Клиент (Frontend)
2. Сервер (Backend)

## Технологии

- Frontend: Vue 3, TypeScript, Tailwind CSS, DaisyUI
- Backend: Node.js, Express, Socket.IO
- API: HeadHunter API

## Установка и запуск

### Клиент

1. Перейдите в директорию клиента:
   ```
   cd client
   ```

2. Установите зависимости:
   ```
   npm install
   ```

3. Запустите клиент в режиме разработки:
   ```
   npm run dev
   ```

4. Для запуска через Tuna (или Ngrok):
   ```
   tuna http localhost:5173 --subdomain={ваш домен}
   ```

### Сервер

1. Перейдите в директорию сервера:
   ```
   cd server
   ```

2. Установите зависимости:
   ```
   npm install
   ```

3. Запустите сервер:
   ```
   npm run dev
   ```

4. Для запуска через Tuna (или Ngrok):
   ```
   tuna http localhost:3000 --subdomain={ваш домен}
   ```

## Особенности

- Интеграция с API HeadHunter для получения вакансий и отправки откликов
- Игровой процесс, стимулирующий быструю реакцию пользователя
- Система уровней и очков для повышения вовлеченности
- Реал-тайм обновления с использованием Socket.IO

## Вклад в проект

Мы приветствуем вклад в развитие проекта! Пожалуйста, ознакомьтесь с [руководством по внесению вклада](CONTRIBUTING.md) перед тем, как начать.

## Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для подробностей.
