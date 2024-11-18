$(document).ready(function () {
    let sequence = Array.from({ length: 10 }, (_, i) => i + 1); 
    let clickedSequence = [];
    let timer;
    let timeLeft = 30;
    let results = loadResultsFromLocalStorage();

    $("#screen1").show();

    $("#startGame").click(function () {
        $("#screen1").hide();
        startGame();
        $("#screen2").show();
    });

    $("#restartGame").click(function () {
        resetGame();
        startGame();
    });

    function startGame() {
        clickedSequence = [];
        timeLeft = 30;
        $("#timer").text(timeLeft);

        const numbers = shuffle(Array.from({ length: 25 }, (_, i) => i + 1));
        $("#grid").empty();
        numbers.forEach((num) => {
            $("<div>")
                .addClass("iav-cell")
                .text(num)
                .css({
                    fontSize: `${Math.random() * 20 + 10}px`,
                    color: getRandomColor(),
                })
                .click(function () {
                    handleCellClick($(this), num);
                })
                .appendTo("#grid");
        });

        timer = setInterval(() => {
            timeLeft -= 1;
            $("#timer").text(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame("Час вийшов!");
            }
        }, 1000);
    }

    function handleCellClick(cell, num) {
        if (num === sequence[clickedSequence.length]) {
            clickedSequence.push(num);
            cell.css("background-color", "lightgreen");
            if (clickedSequence.length === sequence.length) {
                endGame("Вітаю ви виграли!");
            }
        } else {
            endGame("Не вірна цифра");
        }
    }

    function endGame(message) {
        clearInterval(timer);
        $("#dialog").text(message).dialog({
            modal: true,
            buttons: {
                "OK": function () {
                    $(this).dialog("close");
                    if (message === "Вітаю ви виграли!") {
                        saveResult();
                        saveResultsToLocalStorage();
                        showResults();
                    } else {
                        resetGame();
                    }
                },
            },
        });
    }

    function saveResult() {
        const result = { name: `Гра ${results.length + 1}`, time: 30 - timeLeft };
        results.push(result);
    }

    function showResults() {
        $("#screen2").hide();
        $("#screen3").show();
        const $results = $("#results").empty();
        results.forEach((result, index) => {
            $("<tr>")
                .addClass(index === getBestResultIndex() ? "highlight" : "")
                .append($("<td>").text(result.name))
                .append($("<td>").text(`${result.time} с.`))
                .appendTo($results);
        });
    }

    function resetGame() {
        clearInterval(timer);
        $("#screen2").hide();
        $("#screen1").show();
    }

    function getBestResultIndex() {
        return results.reduce((bestIdx, res, idx) =>
            res.time < results[bestIdx].time ? idx : bestIdx, 0);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getRandomColor() {
        return `hsl(${Math.random() * 360}, 100%, 70%)`;
    }

    function saveResultsToLocalStorage() {
        localStorage.setItem("gameResults", JSON.stringify(results));
    }

    function loadResultsFromLocalStorage() {
        const storedResults = localStorage.getItem("gameResults");
        return storedResults ? JSON.parse(storedResults) : [];
    }
});
