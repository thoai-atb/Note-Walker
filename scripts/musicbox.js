class MusicBox {

  static noteAudio = new Map();

  static initAudio() {
    for (const note of noteNames) {
      let filename = note;
      if (note.charAt(0) != note.charAt(0).toUpperCase())
        filename = note.charAt(0).toUpperCase() + "s" + note.charAt(1);
      let audio = new Audio("audio/" + filename + ".wav");
      audio.load();
      this.noteAudio.set(note, audio);
    }
  }

  static debugAudio() {
    for (const aud of this.noteAudio) {
      console.log(aud);
    }
  }

  static analyze(sheet){
      let processSheet = sheet.replaceAll("-", "==");
      let notes = [];
      for (var i = 0; i < processSheet.length/2; i++) {
        let c = processSheet.substring(i*2, i*2 + 2);
        if(c == "==")
          c = "";
        notes.push(c);
      }
      return notes;
  }

  static play(note){
    if(!noteNames.includes(note))
      return false;
    let audio = this.noteAudio.get(note);
    audio.pause();
    audio.currentTime = 0;
    audio.play();
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

  static playSheet(musicSheet, speed){
    let processSheet = musicSheet.replaceAll("-", "  ");
    for (var i = 0; i < processSheet.length/2; i++) {
      let c = processSheet.substring(i*2, i*2 + 2);
      setTimeout(() => MusicBox.play(c), speed * i);
    }
  }

}
