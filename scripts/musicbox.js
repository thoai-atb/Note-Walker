class MusicBox {

  static noteAudio = new Map();
  static loadedNotes = new Set();
  static allNotesLoaded = false;
  static notesToBeLoaded;
  static doorEffect;


  static release(){
    this.noteAudio = new Map();
    this.loadedNotes = new Set();
  }

  static initAudio(sheet) {
    this.notesToBeLoaded = MusicBox.getNotes(sheet);
    for (const note of this.notesToBeLoaded) {
      if(note == "")
        continue;
      let filename = note;
      if (note.charAt(0) != note.charAt(0).toUpperCase())
        filename = note.charAt(0).toUpperCase() + "s" + note.charAt(1);
      let audio = new Audio("audio/" + filename + ".wav");
      audio.note = note;
      audio.load();
      audio.addEventListener('canplaythrough', (e) => {MusicBox.noteLoaded(audio.note);});
      this.noteAudio.set(note, audio);
    }
    this.doorEffect = new Audio('audio/open_door.wav');
    this.doorEffect.load();
  }

  static loadingPercentage(){
    let total = this.noteAudio.size + 1;
    let loaded = this.loadedNotes.size + (this.doorEffect.readyState==4? 1 : 0);
    let percentage = loaded * 100 / total;
    return percentage;
  }

  static allSoundLoaded(){
    return this.doorEffect.readyState == 4 && this.allNotesLoaded;
  }

  static debugAudio() {
    for (const aud of this.noteAudio) {
      console.log(aud);
    }
  }

  static noteLoaded(note){
    this.loadedNotes.add(note);
    if(this.loadedNotes.size == this.notesToBeLoaded.length)
      this.allNotesLoaded = true;
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

  static getNotes(sheet){
      let processSheet = sheet.replaceAll("-", "==");
      let notes = [];
      for (var i = 0; i < processSheet.length/2; i++) {
        let c = processSheet.substring(i*2, i*2 + 2);
        if(c == "==")
          continue;
        if(notes.indexOf(c) == -1)
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

  static playWinSound(){
    this.doorEffect.pause();
    this.doorEffect.volume = 0.2;
    this.doorEffect.play();
  }

}
