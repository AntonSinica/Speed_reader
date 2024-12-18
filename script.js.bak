// script.js

// Выбор элементов
const fileInput = document.getElementById('fileInput');
const speedInput = document.getElementById('speedInput');

// Инициализация переменных
let words = [];
let currentWordIndex = 0;
let intervalId = null;
let isPaused = false;
let speed = 300; // Скорость по умолчанию в миллисекундах
let timeoutId = null;

// Функция для отображения текущего слова
function displayWord() {
    const wordDisplay = document.getElementById('word');
    if (currentWordIndex < words.length) {
        wordDisplay.innerHTML = words[currentWordIndex];
        currentWordIndex++;
        if (!isPaused) {
            timeoutId = setTimeout(displayWord, speed);
        }
    } else {
        // Конец списка слов
        stopReading();
    }
}

// Валидация WPM: допустимый диапазон
function isValidWPM(input) {
    return /^\d+$/.test(input) && parseInt(input) >= 50 && parseInt(input) <= 1200;
}

// Расчет задержки между словами на основе WPM
function calculateDelay(wpm) {
    return wpm > 0 ? 60000 / wpm : 0; // 60000 мс = 1 минута
}

// Обработчик события для изменения скорости
speedInput.addEventListener('input', function() {
    const inputValue = this.value;
    if (isValidWPM(inputValue)) {
        const wpm = parseInt(inputValue);
        speed = calculateDelay(wpm); // speed теперь в миллисекундах
    } else {
        // Установить WPM по умолчанию или обработать некорректный ввод
        speed = calculateDelay(300); // WPM по умолчанию — 300
        alert('Пожалуйста, введите корректное значение WPM от 50 до 1200.');
    }
});

// Обработчик события для выбора файла
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.type === 'text/plain') {
            // Чтение текстовых файлов .txt
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                words = text.split(/\s+/);
                currentWordIndex = 0;
                console.log('Массив слов:', words);
            };
            reader.readAsText(file);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // Чтение файлов .docx
            const reader = new FileReader();
            reader.onload = function(e) {
                const arrayBuffer = e.target.result;
                mammoth.convertToHtml({arrayBuffer: arrayBuffer})
                    .then(function(result) {
                        var html = result.value; // Получаем HTML-код из .docx
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(html, "text/html");
                        var text = doc.body.textContent; // Извлекаем текст из HTML
                        words = text.split(/\s+/); // Разделяем текст на слова
                        currentWordIndex = 0;
                        console.log('Массив слов:', words);
                    })
                    .catch(function(error) {
                        console.error("Ошибка при конвертации .docx файла:", error);
                    });
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('Пожалуйста, выберите текстовый или Word файл (.txt, .docx).');
        }
    } else {
        alert('Файл не выбран.');
    }
});

// Функция для запуска чтения
function startReading() {
    const wpm = parseInt(speedInput.value) || 300;
    if (isValidWPM(wpm)) {
        currentWordIndex = 0;
        isPaused = false;
        speed = calculateDelay(wpm);
        displayWord();
    } else {
        alert('Пожалуйста, введите корректное значение WPM от 50 до 1200.');
    }
    // Обновление состояния кнопок
    document.getElementById('startButton').disabled = true;
    document.getElementById('pauseButton').disabled = false;
    document.getElementById('stopButton').disabled = false;
}

// Функция для приостановки чтения
function pauseReading() {
    isPaused = true;
    clearTimeout(timeoutId);
    // Обновление состояния кнопок
    document.getElementById('pauseButton').disabled = true;
    document.getElementById('startButton').disabled = false;
}

// Функция для возобновления чтения
function resumeReading() {
    isPaused = false;
    displayWord();
    // Обновление состояния кнопок
    document.getElementById('pauseButton').disabled = false;
    document.getElementById('startButton').disabled = true;
}

// Функция для остановки чтения
function stopReading() {
    isPaused = false;
    clearTimeout(timeoutId);
    currentWordIndex = 0;
    document.getElementById('word').innerHTML = '';
    // Обновление состояния кнопок
    document.getElementById('stopButton').disabled = true;
    document.getElementById('startButton').disabled = false;
    document.getElementById('pauseButton').disabled = true;
}

// Добавление обработчиков событий для кнопок
document.getElementById('startButton').addEventListener('click', startReading);
document.getElementById('pauseButton').addEventListener('click', pauseReading);
document.getElementById('stopButton').addEventListener('click', stopReading);

// Инициализация состояния кнопок
document.getElementById('pauseButton').disabled = true;
document.getElementById('stopButton').disabled = true;