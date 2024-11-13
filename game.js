$(document).ready(function() {
    let gameSequence = Array.from({length: 10}, (_, i) => i + 1);
    let selectedSequence = [];
    let timer;
    let timeLeft = 60;
    let gameNumber = 1;
    function showScreen(screenId) {
        $('.screen').hide();
        $(screenId).show();
    }
    function generateGrid() {
        const numbers = Array.from({length: 25}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
        $('#gameGrid').empty();
        numbers.forEach(num => {
            const cell = $('<div></div>').text(num).css({
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                fontSize: `${Math.floor(Math.random() * 10) + 15}px`
            });
            cell.on('click', () => selectNumber(num));
            $('#gameGrid').append(cell);
        });
    }
    function startTimer() {
        clearInterval(timer);
        timeLeft = 60;
        $('#timeLeft').text(timeLeft);
        timer = setInterval(() => {
            timeLeft--;
            $('#timeLeft').text(timeLeft);
            if (timeLeft <= 0) {
                gameOver("Час вийшов!");
            }
        }, 1000);
    }
    function selectNumber(num) {
        const nextInSequence = gameSequence[selectedSequence.length];
        if (num === nextInSequence) {
            selectedSequence.push(num);
            $(`#gameGrid div:contains(${num})`).addClass('highlight');
            if (selectedSequence.length === gameSequence.length) {
                winGame();
            }
        } else {
            gameOver("Не вірна цифра");
        }
    }
    function gameOver(message) {
        clearInterval(timer);
        $('#dialog').text(message).dialog({
            modal: true,
            buttons: {
                "OK": function() {
                    $(this).dialog("close");
                    resetGame();
                }
            }
        });
    }
    function winGame() {
        clearInterval(timer);
        const result = { game: gameNumber++, time: 60 - timeLeft };
        $('#resultsTable').append(`<tr><td>${result.game}</td><td>${result.time} с</td></tr>`);
        $('#dialog').text("Вітаю ви виграли").dialog({
            modal: true,
            buttons: {
                "OK": function() {
                    $(this).dialog("close");
                    showScreen('#screen3');
                    highlightBestResult();
                }
            }
        });
    }
    function resetGame() {
        selectedSequence = [];
        generateGrid();
        startTimer();
    }
    $('#startGame').on('click', () => {
        showScreen('#screen2');
        resetGame();
    });
    $('#restartGame').on('click', () => resetGame());
    $('#playAgain').on('click', () => {
        showScreen('#screen2');
        resetGame();
    });
    showScreen('#screen1');
});
function highlightBestResult() {
    let bestTime = Infinity;
    let bestRow;
    $('#resultsTable tr').each(function() {
        const timeCell = $(this).find('td:nth-child(2)');
        const time = parseInt(timeCell.text());

        if (time && time < bestTime) {
            bestTime = time;
            bestRow = $(this);
        }
    });
    $('#resultsTable tr').removeClass('best-result');
    if (bestRow) {
        bestRow.addClass('best-result');
    }
}

