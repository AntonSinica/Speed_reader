// script.js

// Выбор элементов
const fileInput = document.getElementById('fileInput');
const speedInput = document.getElementById('speedInput');

// Инициализация переменных
let words = [];
let currentWordIndex = 0;
let isPaused = false;
let speed = 1000; // Скорость по умолчанию для WPM=60
let timeoutId = null;
let currentState = 'stopped'; // Возможные состояния: 'stopped', 'reading', 'paused'

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
        stopReading();
    }
}

// Валидация WPM: допустимый диапазон
function isValidWPM(input) {
    return /^\d+$/.test(input) && parseInt(input) >= 1 && parseInt(input) <= 1200;
}

// Расчет задержки между словами на основе WPM
function calculateDelay(wpm) {
    return wpm > 0 ? 60000 / wpm : null; // Возвращаем null, если WPM = 0
}

// Обработчик события для изменения скорости
speedInput.addEventListener('input', function() {
    const inputValue = this.value;
    if (isValidWPM(inputValue)) {
        const wpm = parseInt(inputValue);
        speed = calculateDelay(wpm); // Скорость в миллисекундах
    } else {
        speed = calculateDelay(60); // WPM по умолчанию — 60
        alert('Пожалуйста, введите корректное значение WPM от 1 до 1200.');
    }
});

// Обработчик события для выбора файла
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                words = text.split(/\s+/);
                currentWordIndex = 0;
                console.log('Массив слов:', words);
            };
            reader.readAsText(file);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
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
    if (currentState !== 'stopped') {
        return;
    }
    const wpm = parseInt(speedInput.value) || 60;
    if (wpm === 0) {
        alert('WPM не может быть 0. Пожалуйста, введите значение от 1 до 1200.');
        return;
    }
    if (isValidWPM(wpm)) {
        currentWordIndex = 0;
        isPaused = false;
        speed = calculateDelay(wpm);
        if (speed !== null) {
            displayWord();
            currentState = 'reading';
        } else {
            stopReading();
        }
    } else {
        alert('Пожалуйста, введите корректное значение WPM от 1 до 1200.');
    }
    updateButtonStates();
}

// Функция для приостановки чтения
function pauseReading() {
    if (currentState !== 'reading') {
        return;
    }
    isPaused = true;
    clearTimeout(timeoutId);
    currentState = 'paused';
    updateButtonStates();
}

// Функция для возобновления чтения
function resumeReading() {
    if (currentState !== 'paused') {
        return;
    }
    isPaused = false;
    displayWord();
    currentState = 'reading';
    updateButtonStates();
}

// Функция для остановки чтения
function stopReading() {
    if (currentState === 'stopped') {
        return;
    }
    isPaused = false;
    clearTimeout(timeoutId);
    currentWordIndex = 0;
    document.getElementById('word').innerHTML = '';
    currentState = 'stopped';
    updateButtonStates();
}

// Функция для обновления состояния кнопок
function updateButtonStates() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const stopButton = document.getElementById('stopButton');

    switch (currentState) {
        case 'stopped':
            startButton.disabled = false;
            pauseButton.disabled = true;
            stopButton.disabled = true;
            break;
        case 'reading':
            startButton.disabled = true;
            pauseButton.disabled = false;
            stopButton.disabled = false;
            break;
        case 'paused':
            startButton.disabled = false;
            pauseButton.disabled = true;
            stopButton.disabled = false;
            break;
    }
}

// Добавление обработчиков событий для кнопок
document.getElementById('startButton').addEventListener('click', function() {
    if (currentState === 'paused') {
        resumeReading();
    } else {
        startReading();
    }
});

document.getElementById('pauseButton').addEventListener('click', function() {
    if (currentState === 'reading') {
        pauseReading();
    }
});

document.getElementById('stopButton').addEventListener('click', function() {
    if (currentState !== 'stopped') {
        stopReading();
    }
});

// Инициализация состояния кнопок
updateButtonStates();