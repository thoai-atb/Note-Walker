class Board {
  constructor(musicSheet, size, color) {
    this.size = size;
    this.activatedColor = "#ffffff";
    this.normalColor = color;
    this.musicSheet = musicSheet;
    let notes = MusicBox.analyze(musicSheet);
    this.generateMap(notes);
    // this.buildObstacles();
  }

  gridSize(){
    return this.size;
  }

  index(x, y){
    return this.size * y + x;
  }

  generateMap(notes){
    let size = this.gridSize();
    // Start point
    let start = {
      x : Math.floor(Math.random() * size),
      y : Math.floor(Math.random() * size),
      possibleDirecions : ['u', 'd', 'l', 'r']
    };

    let draft = new Array(size * size); // A draft
    draft.set = function(x, y, value){
      draft[x + y * size] = value;
    };
    draft.get = function(x, y){
      return draft[x + y * size];
    }

    if(!REPEATING_NOTES)
      draft.set(start.x, start.y, '$');

    let stack = [];
    stack.push(start);
    while(stack.length > 0 && stack.length != notes.length + 1){
      let nextNote = notes[stack.length - 1];
      let prev = stack[stack.length - 1];
      if(prev.possibleDirecions.length <= 0){
        draft.set(prev.x, prev.y, prev.previousNote);
        stack.pop();
        continue;
      }
      let dir = prev.possibleDirecions.random();
      let next = {};
      switch(dir){
        case 'u':
          next.x = prev.x;
          next.y = prev.y - 1;
          break;
        case 'd':
          next.x = prev.x;
          next.y = prev.y + 1;
          break;
        case 'l':
          next.x = prev.x - 1;
          next.y = prev.y;
          break;
        case 'r':
          next.x = prev.x + 1;
          next.y = prev.y;
          break;
      }

      let index = prev.possibleDirecions.indexOf(dir);
      prev.possibleDirecions.splice(index, 1);

      let isValid = function() {
        if(next.x < 0 || next.x >= size || next.y < 0 || next.y >= size)
          return false;
        let dest = draft.get(next.x, next.y);
        if(!dest) return true;
        if(REPEATING_NOTES){
          return dest == nextNote || dest == 'step';
        }
        return false;
      };

      if(isValid()){
        stack.push({
          x : next.x,
          y : next.y,
          possibleDirecions : ['u', 'd', 'l', 'r'],
          previousNote : draft.get(next.x, next.y)
        });
        draft.set(next.x, next.y, nextNote || 'step');
      }
    }

    if(stack.length == 0){
      alert("CAN't GENEREATE MAPPE");
      return;
    }

    this.startPoint = start;
    this.data = new Array(this.gridSize() * this.gridSize());
    for(let i = 0; i<this.data.length; i++){
      let s = draft[i];
      if(!s || s == 'step')
        s = '';
      this.data[i] = {
        cooldown: 0,
        note: s
      }
    }
  }

  buildObstacles(){
    for(let i = 0; i < this.data.length; i++){
      let n = this.data[i].note;
      if(n) continue;
      this.data[i].isObstacle = true;
    }
  }

  demoSong(){
    let box = new MusicBox(this.musicSheet, 150);
    box.play();
  }

  getStartPoint(){
    return {x : this.startPoint.x, y : this.startPoint.y};
  }

  startRecording(){
    this.playerAnswer = [];
    this.listening = true;
  }

  checkRecording(){
    this.listening = false;
    let notes = MusicBox.analyze(this.musicSheet);
    let redundantCount = 0;
    for(let note of this.playerAnswer){
      if(note && note != '$')
        break;
      redundantCount++;
    }
    this.playerAnswer.splice(0, redundantCount);
    if(this.playerAnswer.length < notes.length)
      return;
    for(let i = 0; i < notes.length; i++){
      let ans = this.playerAnswer[i];
      if(ans == '$')
        ans = '';
      if(ans != notes[i])
        return;
    }
    this.winning();
  }

  winning(){
    let sound = new Audio('audio/open_door.wav');
    sound.volume = 0.2;
    sound.play();
    nextLevel();
  }

  activate(x, y) {
    let note = this.data[x + y * this.gridSize()].note;
    if(this.listening)
      this.playerAnswer.push(note);
    if(MusicBox.play(note))
      this.data[x + y*this.gridSize()].cooldown = 1;
  }

  update() {
    for(let i = 0; i<this.data.length; i++)
      this.data[i].cooldown *= 0.95;
  }

  display() {
    context.lineWidth = 1;
    for(let i = 0; i<this.gridSize(); i++)
      for(let j = 0; j<this.gridSize(); j++){
        let cell = this.data[i + j*this.gridSize()];
        if(cell.isObstacle)
          continue;

        context.fillStyle = lerpColor(this.normalColor, this.activatedColor, cell.cooldown);

        context.strokeStyle = 'black';
        let u = cellSize();
        let p = 0.9; // ratio padding
        let r = u * 0.1; // round corner
        let x = i * u + (1 - p) * u / 2;
        let y = j * u + (1 - p) * u / 2;
        context.beginPath();
        context.roundedRectangle(x , y, u * p, u * p, r);
        context.fill();
        context.stroke();

        x = i * u + u/2;
        y = j * u + u/2;
        context.fillStyle = "rgb(0, 0, 0, 0.6)"
        context.strokeStyle = "black";
        context.font = u / 3 + "px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        let noteText = MusicBox.toText(cell.note);
        context.fillText(noteText[0] || "", x, y);
        context.font = u / 5 + "px Arial";
        context.fillText(noteText[1] || "", x + u/4, y + u/4);
      }
  }
}
