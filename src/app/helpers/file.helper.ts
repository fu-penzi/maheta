import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem, WriteFileResult } from '@capacitor/filesystem';

import { IPicture } from 'music-metadata-browser';

export function randomFileName(): string {
  return Math.random().toString(36).substring(2);
}

export function compressAndSavePicture(
  picture: IPicture,
  albumName: string
): Promise<string | null> {
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
        path: albumName,
        data: context.canvas.toDataURL('image/jpeg', quality),
        directory: Directory.Library,
      }).then((res: WriteFileResult) => Capacitor.convertFileSrc(res.uri));

      resolve(thumbPath);
    };

    img.onerror = () => {
      resolve(null);
    };
  });
}
