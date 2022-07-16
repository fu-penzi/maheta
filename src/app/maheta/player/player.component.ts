import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem, ReadFileResult } from '@capacitor/filesystem';

import { Track } from '@app/model/track.interface';
import { FileLoadingService } from '@app/services/file-loading.service';
import { Capacitor } from '@capacitor/core';
import { Howl, Howler } from 'howler';
// let jsmediatags = require('jsmediatags');

@Component({
  selector: 'maheta-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  public track: Track = {
    title: 'Lost Sanctuary',
    author: 'Adrian von Ziegler',
    thumbUrl: 'assets/3.webp',
    duration: 3.25,
  };
  // public controlButtons;
  // public adjacentButtons;

  public showTicks: boolean = false;
  public autoTicks: boolean = false;
  public tickInterval: number = 1;
  public value: number = 1;

  public files: any;
  public path: any;
  constructor(private fileLoading: FileLoadingService) {}

  ngOnInit(): void {
    this.setupButtons();
    this.fileLoading.loadMusic();
    Filesystem.getUri({
      path: 'Music/206.mp3',
      directory: Directory.ExternalStorage,
    }).then((res) => {
      console.error(Capacitor.convertFileSrc(res.uri));
      this._trackUri = Capacitor.convertFileSrc(res.uri);
    });
  }

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }

  private _trackUri: string;
  public play(): void {
    const sound = new Howl({
      src: [this._trackUri],
    });
    sound.play();
    // jsmediatags.read('http://192.168.0.105:5501/1.%20206.mp3', {
    //   onSuccess: function (tag: any) {
    //     console.log(tag);
    //   },
    //   onError: function (error: any) {
    //     console.log(':(', error.type, error.info);
    //   },
    // });
    // console.log(`http://192.168.0.105:5501/1.%20206.mp3`);
    // new Audio(
    //   'https://www.chosic.com/wp-content/uploads/2021/07/Raindrops-on-window-sill.mp3'
    // ).play();
  }

  private setupButtons() {
    // this.controlButtons = {
    //   skipPrevious: {
    //     icon: 'skip_previous',
    //     ariaLabel: 'Example icon button with a bookmark icon',
    //   },
    //   playArrow: {
    //     icon: 'play_arrow',
    //     ariaLabel: 'Example icon button with a bookmark icon',
    //   },
    //   skipNext: {
    //     icon: 'skip_next',
    //     ariaLabel: 'Example icon button with a bookmark icon',
    //   },
    // };
    // this.adjacentButtons = {
    //   shuffle: {
    //     icon: 'shuffle',
    //     ariaLabel: 'Example icon button with a bookmark icon',
    //   },
    //   repeat: {
    //     icon: 'repeat',
    //     ariaLabel: 'Example icon button with a bookmark icon',
    //   },
    // };
  }
}
