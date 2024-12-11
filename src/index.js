$(document).ready(function () {
    let sequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let currentStep = 0;
    let timer;
    let results = [];

    function renderFirstScreen() {
        const screen = `
            <div id="first-screen">
                <h1>Моя перша гра</h1>
                <button id="start-game">Розпочати гру</button>
            </div>
        `;
        $("#app").html(screen);
    }

    function renderSecondScreen() {
        const cells = shuffle(Array.from({length: 25}, (_, i) => i + 1))
            .map(num => `
                <div class="cell" style="color: ${randomColor()}; font-size: ${randomSize()}px;">${num}</div>
            `).join('');

        const screen = `
            <div id="second-screen">
                <div id="timer">Time: 0</div>
                <button id="restart-game">Розпочати гру знову</button>
                <div id="grid">
                    ${cells}
                </div>
            </div>
        `;
        $("#app").html(screen);
        startTimer();
    }

    function renderThirdScreen() {
        const rows = results.map((result, index) => {
            const best = result === Math.min(...results) ? 'class="best"' : '';
            return `<tr ${best}><td>${index + 1}</td><td>${result} seconds</td></tr>`;
        }).join('');

        const screen = `
            <div id="third-screen">
                <h2>Results</h2>
                <table border="1">
                    <tr><th>#</th><th>Time</th></tr>
                    ${rows}
                </table>
                <button id="go-to-start">Повернутися на початкову сторінку</button>
            </div>
        `;
        $("#app").html(screen);
    }

    function randomColor() {
        const colors = ["red", "blue", "green", "orange", "purple"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function randomSize() {
        return Math.floor(Math.random() * 20) + 10;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startTimer() {
        let time = 0;
        timer = setInterval(() => {
            time++;
            $("#timer").text(`Time: ${time}`);
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
        return parseInt($("#timer").text().replace("Time: ", ""));
    }

    function showModal(message, onClose) {
        const modal = `
        <div id="modal" class="modal">
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <p>${message}</p>
            </div>
        </div>
    `;
        $("body").append(modal);

        $("#modal").fadeIn();

        $(".close-button").on("click", function () {
            $("#modal").fadeOut(() => {
                $("#modal").remove();
                if (onClose) onClose();
            });
        });
    }


    $(document).on("click", "#start-game", function () {
        renderSecondScreen();
    });

    $(document).on("click", "#restart-game", function () {
        renderSecondScreen();
    });

    $(document).on("click", "#go-to-start", function () {
        renderFirstScreen();
    });

    $(document).on("click", ".cell", function () {
        const number = parseInt($(this).text());

        if (number === sequence[currentStep]) {
            currentStep++;
            $(this).addClass("correct");

            if (currentStep === sequence.length) {
                showModal("Вітаю, ви виграли!", function () {
                    const time = stopTimer();
                    results.push(time);
                    renderThirdScreen();
                });
            }
        } else {
            showModal("Не вірна цифра", function () {
                currentStep = 0;
                renderSecondScreen();
            });
        }

    });

    renderFirstScreen();
});
