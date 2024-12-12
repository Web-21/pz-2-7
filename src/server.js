const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Указываем статическую папку для HTML, CSS и JS
app.use(express.static(path.join(__dirname)));

// Обслуживаем index.html для всех запросов
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
