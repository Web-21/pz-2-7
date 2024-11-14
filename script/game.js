let squareArr = new Array();
let statsArr = new Array();
let square;
let count = 1;
let countTry = 3;
let isWin = false;
let isLose = false;
let num = 60;
let gameCount = 0;
let interval;


function timer(){
    let counterParagraph = document.querySelector('.counter');
    counterParagraph.innerHTML = `Залишилось ${num}`;
    num > 0 ? num-- : (isLose=true, result());
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function getRandomInt(max,min) {
    let number = Math.floor(Math.random() * max);
    if(number<min){
        number+=min;
    }
    return number;
}

function createScene(){
    let scene = document.createElement('div')
    scene.className = 'game_container';
    return scene;
}

function elementClick(element){
    const numberElement = element.srcElement.innerHTML;
    const blockResult = document.getElementById('result');
    if(isWin || isLose){
        return;
    }
    if(count == numberElement){
        $(blockResult).css('display','none');
        $(element.srcElement).css({'background-color' : 'rgb(42, 168, 34)', 'color' : 'rgb(42, 168, 34)', 'cursor': 'default'});
        count++;
        isWin = count == 26 ? true : false;
    }
    else if(numberElement>count) {
        blockResult.innerHTML = `Не вірно! Залишилось ${countTry} спроб.`
        $(blockResult).css({'background-color' : 'rgb(200, 70, 70)', 'display' : 'block'});
        countTry--;
        isLose = countTry < 0 ? true : false;
        result();
    }
    result();
}

function result() {
    const blockResult = document.getElementById('result');
    if(isWin){
        $(blockResult).css({'background-color' : 'rgb(85, 217, 85)', 'display' : 'block'});
        blockResult.innerHTML = 'You win!'
        clearInterval(interval);
        gameCount++;
        let winStats = document.createElement('div');
        winStats.id = 'statsText';
        winStats.innerHTML = `Game: ${gameCount} | Time: ${59-num} sec`;
        statsArr.push(winStats);
        printResults();
    }
    if(isLose){
        $(blockResult).css({'background-color' : 'rgb(200, 70, 70)', 'display' : 'block'});
        blockResult.innerHTML = 'You Lose..'
        clearInterval(interval);
        gameCount++;
    }
}
function printResults(){
    const stats = document.querySelector('.gameStats')
    statsArr.forEach(item=>{
        stats.append(item);
    })
}
function restart(){
    const blockResult = document.getElementById('result');
    let gameContainer = document.querySelector('.game_container');
    document.querySelector('.gameScene_container').remove();
    num = 60;
    isWin = false;
    isLose = false;
    countTry = 3;
    count = 1;
    $(blockResult).css('display','none');
    squareArr = [];
    gameContainer.remove();
    clearInterval(interval);
    createGameScene();
}

function createGameScene(){

    let scene = createScene();
    document.body.append(scene);

    let button = document.createElement('button');
    button.className = 'button';
    button.innerHTML = 'Почати з початку';
    button.addEventListener('click',restart);

    let blockResult = document.createElement('div');
    blockResult.id = 'result';
    scene.append(blockResult);


    let gameSceneContainer = document.createElement('div');
    gameSceneContainer.className = 'gameScene_container';
    for(let i = 1; i< 26; i++){
        square = document.createElement('div')
        square.className = `square square${i}`;
        square.innerHTML = `${i}`;
        $(square).css("color",`${getRandomColor()}`);
        $(square).css("font-size",`${getRandomInt(45,15)}px`);
        square.addEventListener('click',elementClick);
        squareArr.push(square);
    }
    squareArr.sort(() => Math.random() - 0.5);
    for(let key in squareArr){
        gameSceneContainer.append(squareArr[key]);
    }

    let p = document.createElement('p');
    p.className = 'counter';
    p.innerHTML = `Залишилось 60`;

    let gameStats = document.createElement('div');
    gameStats.className = 'gameStats';
    gameStats.innerHTML = 'Your Statistic';

    interval = setInterval(timer, 1000);
    scene.append(p);
    scene.append(gameSceneContainer);
    scene.append(button);
    scene.append(gameStats);

    const stats = document.querySelector('.gameStats')
    statsArr.forEach(item=>{
        stats.append(item);
    })
}

createGameScene();
