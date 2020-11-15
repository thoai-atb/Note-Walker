window.onload = init;

// CONSTANTS
const noteNames = ("C4 c4 D4 d4 E4 F4 f4 G4 g4 A4 a4 B4 " +
                  "C5 c5 D5 d5 E5 F5 f5 G5 g5 A5 a5 B5 " +
                  "C6 c6 D6 d6 E6 F6 f6 G6").split(" ");
const REPEATING_NOTES = false;

var board, game, player;


function init(){
  // EVENT ASSIGNMENTS
  canvas = document.getElementById('thecanvas');
  canvas.tabIndex = 1;
  canvas.addEventListener("keydown", keyPressed);
  canvas.addEventListener("keyup", keyReleased);
  context = canvas.getContext('2d');

  // INITIALIZE GAME STATE
  game = new GameLoading(new GamePlaying());

  // INITIALIZE THE LOOP
  loop();
}

function cellSize(){
  return canvas.width / board.gridSize();
}

function keyPressed(event){
  switch(event.key.toUpperCase()){
    case "W":
      player.queueMove("UP");
      break;
    case "A":
      player.queueMove("LEFT");
      break;
    case "S":
      player.queueMove("DOWN");
      break;
    case "D":
      player.queueMove("RIGHT");
      break;
    case "SHIFT":
      player.prepareMoves();
      break;
    case "F":
      board.demoSong();
      break;
    case "P":
      debug();
      break;
    default:
  }
}

function debug(){
  let sheet = "C5--C5C5---G4---E5--E5E5---C5---C5--E5G5---G5---F5--E5D5-------D5--E5F5---F5---E5--D5E5---C5---C5--E5D5---G4---B4--D5C5";
  let mb = new MusicBox(sheet, 150);
  mb.play();
}

function keyReleased(event){
  if(event.key.toUpperCase() == "SHIFT"){
    board.startRecording();
    player.doPreparedMoves();
  }
}

function loop(){
  game.update();
  clearBackground();
  game.display();
  window.requestAnimationFrame(loop);
}

function fillBackground(color){
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function clearBackground(){
  context.clearRect(0, 0, canvas.width, canvas.height);
}
