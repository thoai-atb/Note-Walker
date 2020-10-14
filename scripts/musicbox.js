class MusicBox {

  constructor(musicSheet, speed){
    this.musicSheet = musicSheet;
    this.speed = speed;
  }

  static analyze(sheet){
      let processSheet = sheet.replaceAll("-", "==");
      let notes = [];
      for (var i = 0; i < processSheet.length/2; i++) {
        let c = processSheet.substring(i*2, i*2 + 2);
        notes.push(c);
      }
      return notes;
  }

  static play(note){
    if(!noteNames.includes(note))
      return false;
    if(note.charAt(0) != note.charAt(0).toUpperCase())
      note = note.charAt(0).toUpperCase() + "s" + note.charAt(1);
    let sound = new Audio("audio/" + note + ".wav");
    sound.play();
    return true;
  }

  static toText(note){
    if(!note)
      return '';
    if(!noteNames.includes(note))
      return '';
    let text = note.charAt(0);
    if(note.charAt(0) != note.charAt(0).toUpperCase())
      text = note.charAt(0).toUpperCase() + "#";
    return [text, note.charAt(1)];
  }

  play(){
    let processSheet = this.musicSheet.replaceAll("-", "  ");
    for (var i = 0; i < processSheet.length/2; i++) {
      let c = processSheet.substring(i*2, i*2 + 2);
      setTimeout(() => MusicBox.play(c), this.speed * i);
    }
  }

}
