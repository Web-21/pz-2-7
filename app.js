$(document).ready(function () {
    let sequence = Array.from({ length: 10 }, (_, i) => i + 1);
    let currentNumber = 0;
    let timer = 0;
    let interval;
    const results = [];
  
    
    $('#screen1').show();
  
    $('#startBtn').click(function () {
      $('#screen1').hide();
      $('#screen2').show();
      initializeGame();
    });
  
    $('#restartBtn').click(function () {
      initializeGame();
    });
  
    $('#backToStart').click(function () {
      $('#screen3').hide();
      $('#screen1').show();
    });
  
    function initializeGame() {
      currentNumber = 0;
      timer = 0;
      clearInterval(interval);
      $('#timer').text('Час: 0');
      generateGrid();
      startTimer();
    }
  
    function startTimer() {
      interval = setInterval(() => {
        timer++;
        $('#timer').text(`Час: ${timer}`);
      }, 1000);
    }
  
    function stopTimer() {
      clearInterval(interval);
    }
  
    function generateGrid() {
        $('#grid').empty();
        const numbers = Array.from({ length: 25 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
      
        numbers.forEach((number, index) => {
          const randomFontSize = Math.floor(Math.random() * (40 - 12 + 1)) + 12; 
          const cell = $('<div>')
            .addClass(`cell variant-${(index % 5) + 1}`)
            .text(number)
            .data('value', number)
            .css('font-size', `${randomFontSize}px`) 
            .click(function () {
              handleCellClick($(this));
            });
          $('#grid').append(cell);
        });
      }
      
      
  
    function handleCellClick(cell) {
      const number = cell.data('value');
  
      if (number === sequence[currentNumber]) {
        cell.css('background-color', 'green');
        currentNumber++;
  
        if (currentNumber === sequence.length) {
          stopTimer();
          recordResult(timer);
          $('#winDialog').dialog({
            buttons: {
              "ОК": function () {
                $(this).dialog('close');
                showResults();
              },
            },
          });
        }
      } else {
        stopTimer();
        $('#errorDialog').dialog({
          buttons: {
            "ОК": function () {
              $(this).dialog('close');
              initializeGame();
            },
          },
        });
      }
    }
  
    function recordResult(time) {
      results.push(time);
    }
  
    function showResults() {
      $('#screen2').hide();
      $('#screen3').show();
  
      const tbody = $('#resultsTable tbody');
      tbody.empty();
  
      results.forEach((result, index) => {
        const row = $('<tr>');
        row.append($('<td>').text(index + 1));
        row.append($('<td>').text(result));
        if (result === Math.min(...results)) {
          row.addClass('highlight');
        }
        tbody.append(row);
      });
    }
  });
  