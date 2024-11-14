'use strict';

function createScene(){
  let scene = document.createElement('div')
  scene.className = 'game_container';
  return scene;
}

function createStartScene(){
  let button = document.createElement('a');  // изменен элемент на <a>
  let p = document.createElement('p');
  let scene = createScene();

  p.className = 'startpage';
  p.innerHTML = 'My first game';
  button.className = 'opengame';  // удален класс 'button'
  button.innerHTML = 'Start the game';
  button.href = 'game.html';  // добавлен атрибут href
  document.body.append(scene);

  scene.append(p);
  scene.append(button);
}

createStartScene();

$(document).ready(function(){
  $("a.opengame").click(function(){
    window.location.href ='game.html'
  });
});
