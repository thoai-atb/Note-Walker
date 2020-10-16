window.onload = init;

// CONSTANTS
const noteNames = ("C4 c4 D4 d4 E4 F4 f4 G4 g4 A4 a4 B4 " +
                  "C5 c5 D5 d5 E5 F5 f5 G5 g5 A5 a5 B5 " +
                  "C6 c6 D6 d6 E6 F6 f6 G6").split(" ");
const REPEATING_NOTES = false;

var currentLevel = 0;
var currentStage = -1;

function init(){
  // EVENT ASSIGNMENTS
  canvas = document.getElementById('thecanvas');
  canvas.tabIndex = 1;
  canvas.addEventListener("keydown", keyPressed);
  canvas.addEventListener("keyup", keyReleased);
  context = canvas.getContext('2d');

  // INITIALIZE AUDIO
  MusicBox.initAudio();
  dooreffect = new Audio('audio/open_door.wav');

  // INITIALIZE LEVEL
  nextLevel();

  // INITIALIZE THE LOOP
  loop();
}

function cellSize(){
  return canvas.width / board.gridSize();
}

function setLevel(level, stage){
  currentLevel = level - 1;
  currentStage = stage - 1;
  buildLevel();
}

function nextLevel(){
  currentStage ++;
  var lvl = LEVELS[currentLevel];
  if(lvl.sheets.length == currentStage){
    currentStage = 0;
    currentLevel ++;
  }
  buildLevel();
}

function buildLevel(){
  let lvl = LEVELS[currentLevel];
  let sheet = lvl.sheets[currentStage];

  board = new Board(sheet, Math.floor(Math.sqrt(sheet.length)) + 1, lvl.color);
  player = new Player();
  let label = document.getElementById('levelstage');
  label.style.color = lvl.color;
  label.innerHTML = "LEVEL " + (currentLevel + 1) + " - " + (currentStage + 1) + "/" + lvl.sheets.length;
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
  board.update();
  player.update();

  displayBackground();
  board.display();
  player.display();
  window.requestAnimationFrame(loop);
}

function displayBackground(){
  context.clearRect(0, 0, canvas.width, canvas.height);
}
