class Player {

  constructor() {
    let start = board.getStartPoint();
    this.x = start.x;
    this.y = start.y;
    let u = cellSize();
    this.displayX = this.toCanvas(this.x);
    this.displayY = this.toCanvas(this.y);
    this.moves = [];
    this.traces = [];
    this.preparing = false;
    this.doingPreparedMoves = false;
  }

  toCanvas(cellCoordinate){
    return cellCoordinate * cellSize() + cellSize() / 2;
  }

  prepareMoves(){
    if(this.doneMove)
      this.preparing = true;
  }

  doPreparedMoves(){
    this.doingPreparedMoves = true;
    this.preparing = false;
  }

  queueMove(direction){
    if(this.doingPreparedMoves)
      return;
    let trace = {x:this.x, y:this.y};
    if(this.traces.length){
      let lastTrace = this.traces[this.traces.length-1];
      trace.x = lastTrace.x;
      trace.y = lastTrace.y;
    }
    switch(direction){
      case "UP":
        trace.y --;
        break;
      case "DOWN":
        trace.y ++;
        break;
      case "LEFT":
        trace.x --;
        break;
      case "RIGHT":
        trace.x ++;
        break;
    }

    // BOUNDARY
    if(trace.x < 0 || trace.y < 0 || trace.x >= board.gridSize() || trace.y >= board.gridSize())
      return;

    // OBSTACLE
    if(board.data[trace.x + trace.y * board.gridSize()].isObstacle)
      return;

    if(!REPEATING_NOTES){
      // GOING BACKWARD
      if(this.traces.length >= 2){
        let before = this.traces[this.traces.length-2];
        if(trace.x == before.x && trace.y == before.y){
          this.traces.pop();
          return;
        }
      }

      // INTERSECTING THE BODY
      for(let oldT of this.traces){
        if(oldT.x == trace.x && oldT.y == trace.y)
          return;
      }

      // INTERSECTING THE TAIL
      if(trace.x == this.x && trace.y == this.y){
        if(this.traces.length == 1)
          this.traces.pop();
        return;
      }
    }

    this.traces.push(trace);
  }

  nextMove(){
    let nextLoc = this.traces.shift();
    this.x = nextLoc.x;
    this.y = nextLoc.y;
    this.doneMove = false;
  }

  update(){
    if(this.doneMove && this.traces.length != 0 && !this.preparing)
      this.nextMove();
    let l = 0.2;
    let u = cellSize();
    this.displayX = Math.lerp(this.displayX, this.toCanvas(this.x), l);
    this.displayY = Math.lerp(this.displayY, this.toCanvas(this.y), l);

    // Move check
    let dX = this.toCanvas(this.x) - this.displayX;
    let dY = this.toCanvas(this.y) - this.displayY;
    let threshold = u * 0.04;
    if(!this.doneMove && Math.abs(dX) < threshold && Math.abs(dY) < threshold){
      this.doneMove = true;
      board.activate(this.x, this.y);
    }
    if(this.doingPreparedMoves && this.doneMove && !this.traces.length){
      this.doingPreparedMoves = false;
      board.checkRecording();
    }
  }

  display() {
    if(this.preparing || this.doingPreparedMoves)
      this.displayPreparedMoves();

    let u = cellSize();
    let r = 0.1 * u;
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(this.displayX, this.displayY, r, 0, 2 * Math.PI);
    context.fill();
  }

  displayPreparedMoves() {
    let u = cellSize();
    let r = 0.1 * u;
    context.strokeStyle = 'rgba(0, 0, 0, 0.2)'
    context.lineWidth = 2 * r;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(this.toCanvas(this.x), this.toCanvas(this.y));
    for(let trace of this.traces){
      context.lineTo(this.toCanvas(trace.x), this.toCanvas(trace.y));
    }
    context.stroke();

    let last = this.traces[this.traces.length - 1];
    if(last){
      context.fillStyle = 'rgba(255, 255, 255, 0.2)';
      context.beginPath();
      context.arc(this.toCanvas(last.x), this.toCanvas(last.y), r, 0, 2 * Math.PI);
      context.fill();
    }
  }
}
