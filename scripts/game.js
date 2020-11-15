class GameLoading {

  constructor(gamePlaying){
    this.gamePlaying = gamePlaying;
    MusicBox.release();
    MusicBox.initAudio(gamePlaying.getSheet());
  }

  update(){
    if(!MusicBox.allSoundLoaded())
      return;
    game = this.gamePlaying;
  }

  display(){
    // this.gamePlaying.display();
    context.strokeStyle = "rgba(255, 255, 255, 0.4)";
    context.lineWidth = 20;
    // context.beginPath();
    // context.roundedRectangle(canvas.width/2, canvas.height/2, canvas.width * 0.75, canvas.height * 0.75, 20);
    // context.stroke();
    context.fillStyle = "rgba(255, 255, 255, 0.4)"
    context.font = canvas.width / 10 + "px Trebuchet MS";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(Math.floor(MusicBox.loadingPercentage()) + "%", canvas.width/2, canvas.height/2);
  }

}

class GamePlaying {

  constructor(){
    this.currentLevel = 0;
    this.currentStage = -1;
    this.nextLevel();
  }

  update(){
    board.update();
    player.update();
  }

  display(){
    board.display();
    player.display();
  }

  getSheet(){
    return LEVELS[this.currentLevel].sheets[this.currentStage];
  }

  setLevel(level, stage){
    this.currentLevel = level - 1;
    this.currentStage = stage - 1;
    this.buildLevel();
  }

  nextLevel(){
    this.currentStage ++;
    var lvl = LEVELS[this.currentLevel];
    if(lvl.sheets.length == this.currentStage){
      this.currentStage = 0;
      this.currentLevel ++;
    }
    this.buildLevel();
  }

  buildLevel(){
    let lvl = LEVELS[this.currentLevel];
    let sheet = lvl.sheets[this.currentStage];

    board = new Board(sheet, Math.floor(Math.sqrt(sheet.length)) + 1, lvl.color);
    player = new Player();
    let label = document.getElementById('levelstage');
    label.style.color = lvl.color;
    label.innerHTML = "LEVEL " + (this.currentLevel + 1) + " - " + (this.currentStage + 1) + "/" + lvl.sheets.length;
    game = new GameLoading(this);
  }
}
