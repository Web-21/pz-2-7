$(document).ready(function() {
    let sequence = [...Array(25).keys()].map(x => x + 1);
    let timer;
    let timeLeft = 30;
    let currentSequence = 1;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function initiateCountdown() {
        timer = setInterval(() => {
            timeLeft--;
            $('#timer').text(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert("Час вийшов!");
                restartGameSession();
            }
        }, 1000);
    }

    function restartGameSession() {
        $('#screen2').hide();
        $('#screen1').show();
        clearInterval(timer);
        timeLeft = 30;
        currentSequence = 1;
        $('#gameField').empty();
    }

    function initializeGameField() {
        $('#gameField').empty();
        shuffle(sequence).forEach(num => {
            const gameCell = $('<div></div>').addClass('game-cell').text(num);
            gameCell.css({
                "font-size": `${Math.floor(Math.random() * 10) + 15}px`,
                "color": `hsl(${Math.random() * 360}, 100%, 50%)`
            });
            gameCell.click(function() {
                if (parseInt($(this).text()) === currentSequence) {
                    $(this).addClass('selected-cell');
                    currentSequence++;
                    if (currentSequence > 10) {
                        clearInterval(timer);
                        $("<div>Вітаю, ви виграли!</div>").dialog();
                        recordGameResult(30 - timeLeft);
                        $('#screen2').hide();
                        $('#screen3').show();
                        showResults();
                    }
                } else {
                    clearInterval(timer);
                    $("<div>Невірна цифра!</div>").dialog();
                    restartGameSession();
                }
            });
            $('#gameField').append(gameCell);
        });
    }

    function recordGameResult(time) {
        let results = JSON.parse(localStorage.getItem('results')) || [];
        results.push({ game: `Гра ${results.length + 1}`, time });
        results.sort((a, b) => a.time - b.time);
        localStorage.setItem('results', JSON.stringify(results));
    }

    function showResults() {
        $('#resultTable').empty();
        let results = JSON.parse(localStorage.getItem('results')) || [];
        results.forEach((result, index) => {
            const row = `<tr${index === 0 ? ' style="background-color: #ffd700;"' : ''}><td>${result.game}</td><td>${result.time} с.</td></tr>`;
            $('#resultTable').append(row);
        });
    }

    $('#startGame').click(function() {
        $('#screen1').hide();
        $('#screen2').show();
        initializeGameField();
        initiateCountdown();
    });

    $('#restartGame').click(restartGameSession);

    $('#screen3').hide().on('show', showResults);
});
