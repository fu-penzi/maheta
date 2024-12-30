import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem, StatResult, WriteFileResult } from '@capacitor/filesystem';

import { Lyrics } from '@src/app/db/domain/lyrics';
import { Track, TrackDefaultsEnum } from '@src/app/db/domain/track';
import { parseLyrics } from '@src/app/helpers/string.helper';
import { TrackWithoutMetadata } from '@src/app/services/file-loading.service';

import { ITag } from 'music-metadata/lib/type';
import { IAudioMetadata, IPicture } from 'music-metadata-browser';

export function randomFileName(): string {
  return Math.random().toString(36).substring(2);
}

export function getDefaultTrackObject(
  trackPath?: string,
  capacitorPath?: string,
  modificationTime?: number
): Track {
  return {
    uri: trackPath || '',
    src: capacitorPath || '',
    title: trackPath?.split('/').pop() ?? TrackDefaultsEnum.TITLE,
    author: TrackDefaultsEnum.AUTHOR,
    album: TrackDefaultsEnum.ALBUM,
    thumbSrc: TrackDefaultsEnum.THUMBSRC,
    thumbFileName: TrackDefaultsEnum.THUMBFILENAME,
    duration: 0,
    lyrics: { isLrcFormat: false, text: '', lines: [] },
    metadataLoaded: false,
    modificationTime,
  };
}

export async function getTrackObject(
  trackWithoutMetadata: TrackWithoutMetadata,
  metadata: IAudioMetadata | null,
  fileModified: boolean
): Promise<Track> {
  let thumbSrc: string | null = '';
  const thumbPicture: IPicture | undefined = metadata?.common.picture?.shift();
  const fileName: string | undefined = trackWithoutMetadata.uri.split('/').pop();
  const lyricsMetadata: string | undefined =
    metadata?.common?.lyrics?.[0] ||
    metadata?.native['ID3v2.4']?.find((el: ITag) => el.id === 'USLT' || el.id === 'SYLT')?.value
      ?.text;
  const thumbFileName: string = (metadata?.common.album || fileName || randomFileName())
    .trim()
    .replace(/#/g, '')
    .replace(/\s+/g, '_');

  if (thumbPicture) {
    thumbSrc = await savePicture(thumbPicture, thumbFileName, fileModified);
  }

  return {
    uri: trackWithoutMetadata.uri,
    src: trackWithoutMetadata.src,
    title: metadata?.common.title ?? fileName ?? TrackDefaultsEnum.TITLE,
    author: metadata?.common.artist?.trim() ?? TrackDefaultsEnum.AUTHOR,
    album: metadata?.common.album?.trim() ?? TrackDefaultsEnum.ALBUM,
    year: metadata?.common.year,
    thumbSrc: thumbSrc || TrackDefaultsEnum.THUMBSRC,
    thumbFileName: thumbPicture ? thumbFileName : TrackDefaultsEnum.THUMBFILENAME,
    duration: metadata?.format.duration ?? 0,
    lyrics: lyricsMetadata ? parseLyrics(lyricsMetadata) : trackWithoutMetadata.lyrics,
    metadataLoaded: true,
    modificationTime: trackWithoutMetadata.modificationTime,
  };
}

async function savePicture(
  picture: IPicture,
  thumbFileName: string,
  fileModified: boolean
): Promise<string | null> {
  let thumbSrc: string | null = '';
  const thumbDetails: StatResult | null = await Filesystem.stat({
    path: thumbFileName,
    directory: Directory.Library,
  }).catch(() => null);

  thumbSrc = thumbDetails ? Capacitor.convertFileSrc(thumbDetails.uri) : null;

  /* Overwrite existing picture if music file modified */
  if (fileModified && thumbSrc && thumbDetails?.mtime) {
    const secondsSinceLastModification: number = (Date.now() - thumbDetails.mtime) / 1000;
    thumbSrc =
      secondsSinceLastModification > 5
        ? await Filesystem.deleteFile({ path: thumbFileName, directory: Directory.Library })
            .then(() => compressAndWritePictureFile(picture, thumbFileName))
            .catch(() => null)
        : thumbSrc;
  }

  if (!thumbSrc) {
    thumbSrc = await compressAndWritePictureFile(picture, thumbFileName).catch(() => null);
  }

  return thumbSrc;
}

function compressAndWritePictureFile(picture: IPicture, fileName: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();

    img.src = `data:${picture.format};base64,${picture.data.toString('base64')}`;

    img.onload = async (e: any) => {
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      const ratio: number = 500 / e.target.width;

      canvas.width = 500;
      canvas.height = e.target.height * ratio;

      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      const quality: number = 70;
      const thumbPath = await Filesystem.writeFile({
        path: fileName,
        data: context.canvas.toDataURL('image/jpeg', quality),
        directory: Directory.Library,
      })
        .then((res: WriteFileResult) => Capacitor.convertFileSrc(res.uri))
        .catch(() => null);
      resolve(thumbPath);
    };

    img.onerror = () => {
      resolve(null);
    };
  });
}
