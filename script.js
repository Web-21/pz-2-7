$(document).ready(function () {
    let games = [];
    let sequence = Array.from({ length: 10 }, (_, i) => i + 1);
    let currentStep = 0;
    let timeLeft = 30;
    let gameId = 1; 

    const showScreen = (screenId) => {
        $('.screen').removeClass('visible');
        $(`#${screenId}`).addClass('visible');
    };

    const saveResultsToLocalStorage = () => {
        localStorage.setItem('games', JSON.stringify(games));
    };    

    const loadResultsFromLocalStorage = () => {
        const savedGames = localStorage.getItem('games');
        if (savedGames) {
            games = JSON.parse(savedGames);
            gameId = games.length > 0 ? games[games.length - 1].id + 1 : 1;
            updateResultsTable();
        }
    };    

    const startTimer = () => {
        timeLeft = 30;
        $('#timer').text(timeLeft);
        timer = setInterval(() => {
            timeLeft--;
            $('#timer').text(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                $("#not-cor").dialog({
                    modal: true,
                    buttons: {
                        OK: function () {
                            $(this).dialog("close");
                            resetGame();
                        }
                    }
                });
            }
        }, 1000);
    };
    
    const resetGame = () => {
        clearInterval(timer);
        currentStep = 0;
        generateBoard();
        showScreen('screen-2');
        startTimer();
    };

    const generateBoard = () => {
        const numbers = Array.from({ length: 25 }, (_, i) => i + 1)
            .sort(() => Math.random() - 0.5);
        $('#game-board').empty();
        numbers.forEach((num) => {
            const cell = $(`<div class="cell">${num}</div>`);
            cell.css({
                'font-size': `${14 + Math.random() * 10}px`,
                'background-color': `hsl(${Math.random() * 360}, 70%, 50%)`,
            });
            cell.on('click', () => handleCellClick(num));
            $('#game-board').append(cell);
        });
    };

    const handleCellClick = (number) => {
        if (number === sequence[currentStep]) {
            currentStep++;
            if (currentStep === sequence.length) {
                clearInterval(timer);
                const score = timeLeft;
                games.push({
                    id: gameId++,
                    score: score,
                });
                saveResultsToLocalStorage();
                updateResultsTable();
                showSucCor();
            }
        } else {
            showNotCor();
            resetGame();
        }
    };
    
    const updateResultsTable = () => {
        const tbody = $('#results-table tbody');
        tbody.empty();
        games.forEach((game) => {
            const row = $(`<tr>
                <td>${game.id}</td>
                <td>${game.score}</td>
            </tr>`);
            tbody.append(row);
        });
    };
    
    const showResults = () => {
        const tbody = $('#results-table tbody');
        tbody.empty();
        results.forEach((score, index) => {
            const row = $(`<tr><td>${index + 1}</td><td>${score}</td></tr>`);
            if (index === 0) {
                row.css('font-weight', 'bold');
            }
            tbody.append(row);
        });
        showScreen('screen-3');
    };

    $(document).ready(() => {
        loadResultsFromLocalStorage();
        showScreen('screen-1');
        $('#start-button').on('click', () => { resetGame(); });
    
        $('#restart-button').on('click', () => { resetGame(); });
    });
    
    showScreen('screen-1');

    function showNotCor() {
        $("#not-cor").dialog({
            modal: true,
            buttons: {
                OK: function () { $(this).dialog("close"); }
            }
        });
    }

    function showSucCor() {
        $("#suc-cor").dialog({
            modal: true,
            buttons: {
                OK: function () {
                    $(this).dialog("close");
                    showScreen('screen-3');
                }
            }
        });
    }
});
