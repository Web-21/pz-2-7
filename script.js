$(document).ready(function() {
    let sequence = [...Array(25).keys()].map(x => x + 1);
    let timer;
    let timeLeft = 30;
    let currentSequence = 1;
    let gameCount = 0; // Лічильник ігор

    $("#error-dialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "ОК": function() {
                $(this).dialog("close");
                resetGame();
            }
        }
    });

    $("#win-dialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Переглянути результати": function() {
                $(this).dialog("close");
                showResults();
            }
        }
    });

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
                $("#error-dialog").dialog("open");
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
                "color": `hsl(${Math.random() * 360}, 100%, 50%)`,
                "text-align": "center"
            });
            cell.click(function() {
                if (parseInt($(this).text()) === currentSequence) {
                    $(this).addClass('correct');
                    currentSequence++;
                    if (currentSequence > 5) {
                        // Перемога
                        clearInterval(timer);
                        gameCount++;
                        let timeUsed = 30 - timeLeft;
                        saveResult(timeUsed);
                        $("#win-dialog").dialog("open");
                    }
                } else {
                    // Помилка
                    clearInterval(timer);
                    $("#error-dialog").dialog("open");
                }
            });
            $('#gameField').append(cell);
        });
    }

    function saveResult(time) {
        let results = JSON.parse(localStorage.getItem('results')) || [];
        results.push({ game: `Гра ${results.length + 1}`, time });
        // Сортуємо результати за часом
        results.sort((a, b) => a.time - b.time);
        localStorage.setItem('results', JSON.stringify(results));
    }

    function showResults() {
        $('#screen2').hide();
        $('#screen1').hide();
        $('#screen3').show();
        displayResults();
    }

    function displayResults() {
        $('#resultTable').empty();
        let results = JSON.parse(localStorage.getItem('results')) || [];
        if (results.length === 0) return;
        // Найкращий час (перший після сортування)
        let bestTime = results[0].time;

        results.forEach((result) => {
            let tr = $('<tr></tr>');
            let tdName = $('<td></td>').text(result.game);
            let tdTime = $('<td></td>').text(result.time + " с.");
            tr.append(tdName).append(tdTime);
            if (result.time === bestTime) {
                tr.addClass('best');
            }
            $('#resultTable').append(tr);
        });
    }

    $('#startGame').click(function() {
        $('#screen1').hide();
        $('#screen3').hide();
        $('#screen2').show();
        currentSequence = 1;
        timeLeft = 30;
        $('#timer').text(timeLeft);
        setupGameField();
        startTimer();
    });

    $('#restartGame').click(function() {
        resetGame();
    });

});
