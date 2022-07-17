import { Component, OnInit } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem, GetUriResult, ReadFileResult } from '@capacitor/filesystem';

import { Track } from '@src/app/model/track.interface';
import { FileLoadingService } from '@src/app/services/file-loading.service';

// import { Howl, Howler } from 'howler';
import * as musicMetadata from 'music-metadata-browser';
import { IAudioMetadata } from 'music-metadata-browser';

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
  public value = 1;

  public files: any;
  public path: any;

  constructor(private fileLoading: FileLoadingService) {}

  ngOnInit(): void {
    this.setupButtons();
    this.fileLoading.loadMusic();
    Filesystem.getUri({
      path: 'Music/206.mp3',
      directory: Directory.ExternalStorage,
    }).then((res: GetUriResult) => {
      this._trackUri = Capacitor.convertFileSrc(res.uri);
    });
  }

  public getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }

  private readTrackMetadata(path: string): Promise<IAudioMetadata> {
    return Filesystem.readFile({ path: path })
      .then((res: ReadFileResult) => fetch(`data:audio/mpeg;base64, ${res.data}`))
      .then((res: Response) => res.blob())
      .then((res: Blob) => musicMetadata.parseBlob(res));
    // .catch((error) => console.error(error));
  }

  private _trackUri: string;
  public play(): void {
    // const sound = new Howl({
    //   src: [this._trackUri],
    // });
    // sound.play();
    this.readTrackMetadata(`file:///sdcard/Music/206.mp3`).then((res: IAudioMetadata) => {
      console.error(res.common.title);
    });
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
