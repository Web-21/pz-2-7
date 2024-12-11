$(document).ready(function () {
    let games = [];
    let sequence = Array.from({ length: 10 }, (_, i) => i + 1);
    let currentStep = 0;
    let timeLeft = 60;
    let gameId = 1; 

    const showScreen = (screenId) => {
        $('.screen').removeClass('visible');
        $(`#${screenId}`).addClass('visible');
    };
    const loadResultsFromLocalStorage = () => {
        const savedGames = localStorage.getItem('games');
        if (savedGames) {
            games = JSON.parse(savedGames);
            gameId = games.length > 0 ? games[games.length - 1].id + 1 : 1;
            updateResultsTable();
        }
    };    

    const saveResultsToLocalStorage = () => {
        localStorage.setItem('games', JSON.stringify(games));
    };    


    const startTimer = () => {
        timeLeft = 60;
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
        $('#game-board').empty();
        generateBoard();
        showScreen('screen-2');
        startTimer();
    };

    const handleCellClick = (cell, number) => {
        console.log('Cell clicked:', cell, 'Number:', number);
        if (number === sequence[currentStep]) {
            console.log('Correct cell!');
            cell.addClass('clicked');
            currentStep++;
            if (currentStep === sequence.length) {
                clearInterval(timer);
                const score = timeLeft;
                games.push({ id: gameId++, score });
                saveResultsToLocalStorage();
                updateResultsTable();
                showSucCor();
            }
        } else {
            console.log('Incorrect cell!');
            showNotCor();
            resetGame();
        }
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
            cell.on('click', function () {
                handleCellClick($(this), num);
            });
            $('#game-board').append(cell);
        });
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
    

    $(document).ready(() => {
        loadResultsFromLocalStorage();
        showScreen('screen-1');
        $('#start-button').on('click', () => { resetGame(); });
    
        $('#restart-button').on('click', () => { resetGame(); });
    });
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
