import { Component } from '@angular/core';

import { Track } from '@src/app/model/track.interface';
import { images } from '@src/mock/images ';

@Component({
  selector: 'maheta-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent {
  public images = images;
  public tracks: Track[] = [
    {
      title: 'Lost Sanctuary',
      author: 'Adrian von Ziegler',
      duration: 3.25,
    },
    {
      title: 'Curtains Up',
      author: 'Eminem',
      duration: 3.25,
    },
    {
      title: 'Evil Deeds',
      author: 'Eminem',
      duration: 3.25,
    },
    {
      title: 'Mosh',
      author: 'Eminem',
      duration: 3.25,
    },
    {
      title: 'My 1st Single',
      author: 'Eminem',
      duration: 3.25,
    },
    {
      title: 'Paul (skit)',
      author: 'Eminem',
      duration: 3.25,
    },
    {
      title: 'Puke',
      author: 'Eminem',
      duration: 3.25,
    },
    {
      title: 'Lost Sanctuary',
      author: 'Adrian von Ziegler',
      duration: 3.25,
    },
    {
      title: 'Curtains Up',
      author: 'Eminem',
      duration: 3.25,
    },
    {
      title: 'Evil Deeds',
      author: 'Eminem',
      duration: 3.25,
    },
    {
      title: 'Mosh',
      author: 'Eminem',
      duration: 3.25,
    },
    {
      title: 'My 1st Single',
      author: 'Eminem',
      duration: 3.25,
    },
    {
      title: 'Paul (skit)',
      author: 'Eminem',
      duration: 3.25,
    },
    {
      title: 'Puke',
      author: 'Eminem',
      duration: 3.25,
    },
  ];
  constructor() {}
}
