$(document).ready(function () {
    let timer = 60; 
    let interval;
    let sequence = Array.from({ length: 10 }, (_, i) => i + 1);
    let currentIndex = 0;
    let results = [];
    
    const colors = ['red', 'blue', 'green', 'orange', 'purple'];

    function showScreen(screenId) {
        $('.screen').removeClass('active');
        $(`#${screenId}`).addClass('active');
    }

    function startGame() {
        currentIndex = 0;
        timer = 60; 
        $('#timer').text(timer);
        $('#gameField').empty();
        const numbers = Array.from({ length: 15 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
      
        numbers.forEach(num => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            $('#gameField').append(
                `<div class="cell" style="color: ${randomColor}">${num}</div>`
            );
        });

        interval = setInterval(() => {
            timer--;
            $('#timer').text(timer);
            if (timer <= 0) {
                clearInterval(interval);
                endGame("Час вийшов! Гра закінчена.");
            }
        }, 1000);
    }

    function endGame(message) {
        clearInterval(interval);
        $('#popup').text(message).dialog({
            modal: true,
            buttons: {
                OK: function () {
                    $(this).dialog("close");
                    if (message === "Вітаю ви виграли") {
                        results.push(60 - timer); 
                        updateResults();
                        showScreen('screen3');
                    } else {
                        showScreen('screen1');
                    }
                }
            }
        });
    }

    function updateResults() {
        const tbody = $('#resultsTable tbody');
        tbody.empty();

        const minTime = Math.min(...results);

        results.forEach((time, index) => {
            const rowClass = time === minTime ? 'highlighted' : '';
            tbody.append(`
                <tr class="${rowClass}">
                    <td>${index + 1}</td>
                    <td>${time} сек</td>
                </tr>
            `);
        });
    }

    $('#startButton').on('click', () => {
        showScreen('screen2');
        startGame();
    });

    $('#restartButton').on('click', startGame);

    $('#gameField').on('click', '.cell', function () {
        const number = parseInt($(this).text());
        if (number === sequence[currentIndex]) {
            $(this).addClass('correct');
            currentIndex++;
            if (currentIndex === sequence.length) {
                endGame("Вітаю ви виграли");
            }
        } else {
            endGame("Не вірна цифра");
        }
    });

    $('#backToStart').on('click', () => {
        showScreen('screen1');
    });

    showScreen('screen1');
});
