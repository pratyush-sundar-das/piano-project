import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-piano',
  templateUrl: './piano.component.html',
  styleUrls: ['./piano.component.css']
})
export class PianoComponent implements OnInit, OnDestroy {
  notes: { note: string; isBlack: boolean; keyBind?: string }[] = [];
  activeNote: string | null = null;
  private audio: HTMLAudioElement | null = null;

  keyMap: Record<string, string> = {
    'a': 'C3', 'w': 'C#3', 's': 'D3', 'e': 'D#3', 'd': 'E3',
    'f': 'F3', 't': 'F#3', 'g': 'G3', 'y': 'G#3', 'h': 'A3',
    'u': 'A#3', 'j': 'B3', 'k': 'C4', 'o': 'C#4', 'l': 'D4',
    'p': 'D#4', ';': 'E4', "'": 'F4', '[': 'F#4', ']': 'G4',
    'z': 'G#4', 'x': 'A4', 'c': 'A#4', 'v': 'B4', 'b': 'C5',
    'n': 'C#5', 'm': 'D5', ',': 'D#5', '.': 'E5', '/': 'F5',
    'A': 'F#5', 'Q': 'G5', 'W': 'G#5', 'S': 'A5', 'E': 'A#5',
    'D': 'B5', 'F': 'C6', 'T': 'C#6', 'G': 'D6', 'Y': 'D#6',
    'H': 'E6', 'U': 'F6', 'J': 'F#6', 'K': 'G6', 'O': 'G#6',
    'L': 'A6', 'P': 'A#6', '1': 'B6', '2': 'C7', '3': 'C#7',
    '4': 'D7', '5': 'D#7', '6': 'E7', '7': 'F7', '8': 'F#7',
    '9': 'G7', '0': 'G#7', '-': 'A7', '=': 'A#7', ' ': 'B7'
  };
  
  
  

  constructor() {}

  ngOnInit(): void {
    this.notes = this.generateFullPiano(); // ✅ Generate notes here
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    const note = this.keyMap[event.key];
    if (note) {
      this.playNote(note);
    }
  }

  playNote(note: string): void {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();  // Prevent focus click sound
    }
  
    const encodedNote = encodeURIComponent(note);
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.audio = new Audio(`http://localhost:8080/api/audio/${encodedNote}`);
    this.audio.play().catch(err => console.error('Audio error:', err));
    this.activeNote = note;
    setTimeout(() => this.activeNote = null, 200);
  }
  
  

  generateFullPiano(): { note: string; isBlack: boolean; keyBind?: string }[] {
    const notes: { note: string; isBlack: boolean; keyBind?: string }[] = [];
    const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const blackNotes = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];

    for (let octave = 0; octave <= 8; octave++) {
      for (let i = 0; i < whiteNotes.length; i++) {
        const white = `${whiteNotes[i]}${octave}`;
        if (octave === 0 && white !== 'A0' && white !== 'B0') continue;
        if (octave === 8 && white !== 'C8') continue;

        notes.push({ note: white, isBlack: false });

        const blackName = blackNotes[i];
        if (blackName) {
          const black = `${blackName}${octave}`;
          if (!(octave === 0 && black === 'C#0') && !(octave === 8)) {
            notes.push({ note: black, isBlack: true });
          }
        }
      }
    }


    notes.forEach(note => {
      const key = Object.keys(this.keyMap).find(key => this.keyMap[key] === note.note);
      if (key) {
        note.keyBind = key;
      }
    });

    return notes;
  }
  getMappedKeys(): string[] {
    return Object.keys(this.keyMap);
  }
  
  isBlackKey(key: string): boolean {
    const note = this.keyMap[key];
    return note.includes('#');
  }
  
}
