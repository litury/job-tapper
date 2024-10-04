import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { authHandler } from './socketHandlers/authHandler';
import { vacancyHandler } from './socketHandlers/vacancyHandler';
import { resumeHandler } from './socketHandlers/resumeHandler';
import { Queue } from './shared/utils/queue';
import { processApplicationQueue } from './services/applicationService';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(cors({
  origin: ["https://job-tapper-frontend.ru.tuna.am", "http://localhost:5173"],
  credentials: true
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://job-tapper-frontend.ru.tuna.am", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const userSessions = new Map();
const applicationQueue = new Queue();

io.on('connection', (socket) => {
  authHandler(socket, userSessions);
  vacancyHandler(socket, userSessions, applicationQueue);
  resumeHandler(socket, userSessions);
});

// Запускаем обработку очереди каждые 5 секунд
setInterval(() => processApplicationQueue(applicationQueue, io), 5000);

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});