$(document).ready(function () {
    let currentScreen = "#first-screen";
    let timer = 0;
    let timerInterval = null;
    let correctSequence = Array.from({ length: 10 }, (_, i) => i + 1);
    let currentStep = 0;
    let results = [];

    function showScreen(screenId) {
        $(currentScreen).hide();
        $(screenId).show();
        currentScreen = screenId;
    }

    function startTimer() {
        timer = 0;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timer++;
            $("#timer").text(`Timer: ${timer}s`);
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function createGrid() {
        const grid = $("#cell-grid");
        grid.empty();
        const numbers = [...Array(25).keys()].map(x => x + 1);
        const shuffledNumbers = numbers.sort(() => Math.random() - 0.5);

        shuffledNumbers.forEach(num => {
            const color = `hsl(${Math.random() * 360}, 70%, 80%)`;
            const fontSize = `${Math.random() * 10 + 14}px`;
            const cell = $(`<div class="cell" data-value="${num}">${num}</div>`);
            cell.css({ backgroundColor: color, fontSize: fontSize });
            grid.append(cell);
        });
    }
    function handleCellClick() {
        $(".cell").on("click", function () {
            const value = parseInt($(this).data("value"));
            if (value === correctSequence[currentStep]) {
                currentStep++;
                if (currentStep === correctSequence.length) {
                    stopTimer();
                    results.push(timer);
                    showSuccessDialog();
                }
            } else {
                showErrorDialog();
                restartGame();
            }
        });
    }
    function showErrorDialog() {
        $("#error-dialog").dialog({
            modal: true,
            buttons: {
                OK: function () {
                    $(this).dialog("close");
                }
            }
        });
    }
    function showSuccessDialog() {
        $("#success-dialog").dialog({
            modal: true,
            buttons: {
                OK: function () {
                    $(this).dialog("close");
                    showResultsScreen();
                }
            }
        });
    }


    function showResultsScreen() {
        const tbody = $("#results-table tbody");
        tbody.empty();
        results.forEach((time, index) => {
            const row = $(`<tr><td>${index + 1}</td><td>${time}</td></tr>`);
            tbody.append(row);
        });
        const bestResultIndex = results.indexOf(Math.min(...results));
        $(`#results-table tbody tr:eq(${bestResultIndex})`).addClass("best-result");
        showScreen("#third-screen");
    }

    function restartGame() {
        stopTimer();
        currentStep = 0;
        createGrid();
        handleCellClick();
        startTimer();
    }
    $("#start-button").on("click", function () {
        showScreen("#second-screen");
        restartGame();
    });

    $("#restart-button").on("click", restartGame);

    $("#restart-game").on("click", function () {
        showScreen("#first-screen");
    });

    showScreen("#first-screen");
});