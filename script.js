$(document).ready(function () {
    const maxItems = 25;
    const gameDuration = 30;
    let numberList = Array.from({ length: maxItems }, (_, i) => i + 1);
    let countdown;
    let remainingTime = gameDuration;
    let currentNumber = 1;

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function startCountdown() {
        $('#timerDisplay').text(remainingTime);
        countdown = setInterval(() => {
            remainingTime--;
            $('#timerDisplay').text(remainingTime);
            if (remainingTime <= 0) {
                clearInterval(countdown);
                alert("Час вийшов! Спробуйте знову.");
                restartGame();
            }
        }, 1000);
    }

    function restartGame() {
        clearInterval(countdown);
        remainingTime = gameDuration;
        currentNumber = 1;
        $('#mainGame').hide();
        $('#startScreen').show();
        $('#gridArea').empty();
    }

    function createGameField() {
        $('#gridArea').empty();
        shuffleArray(numberList).forEach(num => {
            const cell = $('<div></div>')
                .addClass('grid-cell')
                .text(num)
                .css({
                    "font-size": `${Math.random() * 10 + 15}px`,
                    "color": `hsl(${Math.random() * 360}, 100%, 50%)`
                })
                .click(function () {
                    if (parseInt($(this).text()) === currentNumber) {
                        $(this).addClass('selected');
                        currentNumber++;
                        if (currentNumber > 10) {
                            clearInterval(countdown);
                            const resultTime = gameDuration - remainingTime;
                            alert(`Вітаємо! Ви завершили гру за ${resultTime} секунд.`);
                            saveScore(resultTime);
                            $('#mainGame').hide();
                            $('#scoreScreen').show();
                            showScores();
                        }
                    } else {
                        clearInterval(countdown);
                        alert("Помилка! Гра завершена.");
                        restartGame();
                    }
                });
            $('#gridArea').append(cell);
        });
    }

    function saveScore(time) {
        const scores = JSON.parse(localStorage.getItem('playerScores')) || [];
        scores.push({ game: `Гра ${scores.length + 1}`, time: time });
        scores.sort((a, b) => a.time - b.time);
        localStorage.setItem('playerScores', JSON.stringify(scores));
    }

    function showScores() {
        const scores = JSON.parse(localStorage.getItem('playerScores')) || [];
        $('#scoreTable').empty();
        scores.forEach((score, index) => {
            $('#scoreTable').append(
                `<tr${index === 0 ? ' style="background-color: #ffd700;"' : ''}>
                    <td>${score.game}</td>
                    <td>${score.time} с.</td>
                </tr>`
            );
        });
    }

    $('#playButton').click(() => {
        $('#startScreen').hide();
        $('#mainGame').show();
        createGameField();
        startCountdown();
    });

    $('#resetButton').click(restartGame);

    $('#scoreScreen').hide().on('show', showScores);
});
