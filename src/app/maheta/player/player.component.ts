import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

import { Track } from '@app/model/track.interface';

let jsmediatags = require('jsmediatags');

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
  constructor() {}

  ngOnInit(): void {
    this.setupButtons();
    this.loadTracksData();
    Filesystem.readdir({
      path: 'file:///storage/emulated/0',
    }).then((res) => (this.path = res.files));
  }

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }

  public play(): void {
    jsmediatags.read('http://localhost:5500/1.%20206.mp3', {
      onSuccess: function (tag: any) {
        console.log(tag);
      },
      onError: function (error: any) {
        console.log(':(', error.type, error.info);
      },
    });
    new Audio('http://localhost:5500/1.%20206.mp3').play();
  }

  private loadTracksData() {
    // Filesystem.readdir({
    //   path: 'file:///',
    //   // directory: Directory.ExternalStorage,
    // }).then((res) => (this.files = res.files));
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
