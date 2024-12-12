$(document).ready(function () {
    let timer;
    let timeLeft = 60;
    let correctSequence = 1;
    let results = [];

    function startTimer() {
        timeLeft = 60;
        $('#timer').text(timeLeft);
        timer = setInterval(() => {
            timeLeft--;
            $('#timer').text(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                gameOver(false);
            }
        }, 1000);
    }

    function generateGrid() {
        const numbers = Array.from({ length: 25 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
        $('#grid').empty();
        numbers.forEach((num) => {
            const button = $('<button>')
                .text(num)
                .css('color', getRandomColor())
                .click(() => handleNumberClick(num));
            $('#grid').append(button);
        });
    }

    function handleNumberClick(num) {
        if (num === correctSequence) {
            correctSequence++;
            if (correctSequence > 5) {
                clearInterval(timer);
                gameOver(true);
            }
        } else {
            $('#dialog').text('Не вірна цифра!').dialog();
            resetGame();
        }
    }

    function resetGame() {
        clearInterval(timer);
        correctSequence = 1;
        startTimer();
        generateGrid();
    }

    function gameOver(success) {
        if (success) {
            const result = 60 - timeLeft;
            results.push(result);
            $('#dialog').text('Вітаю, ви виграли!').dialog();
            showResults();
        } else {
            $('#dialog').text('Час вийшов!').dialog();
            resetGame();
        }
    }

    function showResults() {
        $('#game-screen').hide();
        $('#results-screen').show();
        const tbody = $('#results-table tbody');
        tbody.empty();
        results.forEach((result, index) => {
            const row = $('<tr>')
                .append(`<td>Гра ${index + 1}</td>`)
                .append(`<td>${result} с.</td>`);
            tbody.append(row);
        });
        highlightBestResult();
    }

    function highlightBestResult() {
        const bestResult = Math.min(...results);
        $('#results-table tbody tr').each(function () {
            const time = parseInt($(this).find('td:nth-child(2)').text());
            if (time === bestResult) {
                $(this).addClass('highlight');
            }
        });
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    $('#start-game').click(() => {
        $('#start-screen').hide();
        $('#game-screen').show();
        resetGame();
    });

    $('#restart-game').click(resetGame);

    $('#play-again').click(() => {
        $('#results-screen').hide();
        $('#start-screen').show();
    });
});
