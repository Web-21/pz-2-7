$(document).ready(function () {
    let numbers = Array.from({ length: 25 }, (_, i) => i + 1);
    let countdownTimer;
    let remainingTime = 30;
    let currentNumber = 1;

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function startCountdown() {
        $('#countdown').text(remainingTime);
        countdownTimer = setInterval(() => {
            remainingTime--;
            $('#countdown').text(remainingTime);
            if (remainingTime <= 0) {
                clearInterval(countdownTimer);
                alert("Час вийшов! Спробуйте ще раз.");
                restartGame();
            }
        }, 1000);
    }

    function restartGame() {
        $('#gameScreen').hide();
        $('#welcomeScreen').show();
        clearInterval(countdownTimer);
        remainingTime = 30;
        currentNumber = 1;
        $('#playField').empty();
    }

    function createGameField() {
        $('#playField').empty();
        shuffleArray(numbers).forEach(num => {
            const cell = $('<div></div>')
                .addClass('grid-item')
                .text(num)
                .css({
                    "font-size": `${Math.random() * 10 + 15}px`,
                    "color": `hsl(${Math.random() * 360}, 100%, 50%)`
                })
                .click(function () {
                    const clickedNumber = parseInt($(this).text());
                    if (clickedNumber === currentNumber) {
                        $(this).addClass('correct');
                        currentNumber++;
                        if (currentNumber > 10) {
                            clearInterval(countdownTimer);
                            alert(`Вітаємо! Ви виграли за ${30 - remainingTime} секунд.`);
                            saveGameResult(30 - remainingTime);
                            $('#gameScreen').hide();
                            $('#resultScreen').show();
                            showGameResults();
                        }
                    } else {
                        clearInterval(countdownTimer);
                        alert("Невірна цифра! Гра завершена.");
                        restartGame();
                    }
                });
            $('#playField').append(cell);
        });
    }

    function saveGameResult(time) {
        let gameResults = JSON.parse(localStorage.getItem('gameResults')) || [];
        gameResults.push({ game: `Гра ${gameResults.length + 1}`, time });
        gameResults.sort((a, b) => a.time - b.time);
        localStorage.setItem('gameResults', JSON.stringify(gameResults));
    }

    function showGameResults() {
        $('#resultsTable').empty();
        const gameResults = JSON.parse(localStorage.getItem('gameResults')) || [];
        gameResults.forEach((result, index) => {
            $('#resultsTable').append(
                `<tr${index === 0 ? ' style="background-color: #ffd700;"' : ''}>
                    <td>${result.game}</td>
                    <td>${result.time} с.</td>
                </tr>`
            );
        });
    }

    // Обробка подій кнопок
    $('#startButton').click(() => {
        $('#welcomeScreen').hide();
        $('#gameScreen').show();
        createGameField();
        startCountdown();
    });

    $('#restartButton').click(restartGame);

    $('#resultScreen').hide().on('show', showGameResults);
});
