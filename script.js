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

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            $('#timer').text(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert("Час вийшов!");
                resetGame();
            }
        }, 1000);
    }

    function resetGame() {
        $('#screen2').hide();
        $('#screen1').show();
        clearInterval(timer);
        timeLeft = 30;
        currentSequence = 1;
        $('#gameField').empty();
    }

    function setupGameField() {
        $('#gameField').empty();
        shuffle(sequence).forEach(num => {
            const cell = $('<div></div>').addClass('cell').text(num);
            cell.css({
                "font-size": `${Math.floor(Math.random() * 10) + 15}px`,
                "color": `hsl(${Math.random() * 360}, 100%, 50%)`
            });
            cell.click(function() {
                if (parseInt($(this).text()) === currentSequence) {
                    $(this).addClass('correct');
                    currentSequence++;
                    if (currentSequence > 10) {
                        clearInterval(timer);
                        $("<div>Вітаю ви виграли!</div>").dialog();
                        saveResult(30 - timeLeft);
                        $('#screen2').hide();
                        $('#screen3').show();
                        displayResults();
                    }
                } else {
                    clearInterval(timer);
                    $("<div>Не вірна цифра</div>").dialog();
                    resetGame();
                }
            });
            $('#gameField').append(cell);
        });
    }

    function saveResult(time) {
        let results = JSON.parse(localStorage.getItem('results')) || [];
        results.push({ game: `Гра ${results.length + 1}`, time });
        results.sort((a, b) => a.time - b.time);
        localStorage.setItem('results', JSON.stringify(results));
    }

    function displayResults() {
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
        setupGameField();
        startTimer();
    });

    $('#restartGame').click(resetGame);

    $('#screen3').hide().on('show', displayResults);
});
