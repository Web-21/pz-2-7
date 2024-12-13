$(document).ready(function () {
    const totalNumbers = 25;
    const maxTime = 30;
    let numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
    let timer;
    let timeLeft = maxTime;
    let nextNumber = 1;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function initializeTimer() {
        $('#countdown').text(timeLeft);
        timer = setInterval(() => {
            timeLeft--;
            $('#countdown').text(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert("Час вийшов! Спробуйте ще раз.");
                resetGame();
            }
        }, 1000);
    }

    function resetGame() {
        clearInterval(timer);
        timeLeft = maxTime;
        nextNumber = 1;
        $('#gameScreen').hide();
        $('#welcomeScreen').show();
        $('#playField').empty();
    }

    function renderGameField() {
        $('#playField').empty();
        shuffle(numbers).forEach(num => {
            const cell = $('<div></div>')
                .addClass('grid-item')
                .text(num)
                .css({
                    "font-size": `${Math.random() * 10 + 15}px`,
                    "color": `hsl(${Math.random() * 360}, 100%, 50%)`
                })
                .click(function () {
                    if (parseInt($(this).text()) === nextNumber) {
                        $(this).addClass('correct');
                        nextNumber++;
                        if (nextNumber > 10) {
                            clearInterval(timer);
                            const score = maxTime - timeLeft;
                            alert(`Вітаємо! Ви завершили гру за ${score} секунд.`);
                            saveResults(score);
                            $('#gameScreen').hide();
                            $('#resultScreen').show();
                            displayResults();
                        }
                    } else {
                        clearInterval(timer);
                        alert("Невірний вибір! Гру завершено.");
                        resetGame();
                    }
                });
            $('#playField').append(cell);
        });
    }

    function saveResults(score) {
        const results = JSON.parse(localStorage.getItem('gameResults')) || [];
        results.push({ game: `Гра ${results.length + 1}`, time: score });
        results.sort((a, b) => a.time - b.time);
        localStorage.setItem('gameResults', JSON.stringify(results));
    }

    function displayResults() {
        const results = JSON.parse(localStorage.getItem('gameResults')) || [];
        $('#resultsTable').empty();
        results.forEach((result, index) => {
            $('#resultsTable').append(
                `<tr${index === 0 ? ' style="background-color: #ffd700;"' : ''}>
                    <td>${result.game}</td>
                    <td>${result.time} с.</td>
                </tr>`
            );
        });
    }

    // Button event handlers
    $('#startButton').click(() => {
        $('#welcomeScreen').hide();
        $('#gameScreen').show();
        renderGameField();
        initializeTimer();
    });

    $('#restartButton').click(resetGame);

    $('#resultScreen').hide().on('show', displayResults);
});
