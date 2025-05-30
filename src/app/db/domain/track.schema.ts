import { Track } from '@src/app/db/domain/track';

import { RxJsonSchema } from 'rxdb';

export const trackSchema: RxJsonSchema<Track> = {
  title: 'track schema',
  version: 0,
  primaryKey: 'uri',
  type: 'object',
  properties: {
    uri: {
      type: 'string',
      maxLength: 10000, // <- the primary key must have set maxLength
    },
    src: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    author: {
      type: 'string',
    },
    thumbSrc: {
      type: 'string',
    },
    thumbFileName: {
      type: 'string',
    },
    album: {
      type: 'string',
    },
    metadataLoaded: {
      type: 'boolean',
    },
    year: {
      type: 'number',
    },
    number: {
      type: 'number',
    },
    duration: {
      description: 'track duration',
      type: 'number',
    },
    lyrics: {
      type: 'object',
      properties: {
        isLrcFormat: {
          type: 'boolean',
        },
        text: {
          type: 'string',
        },
        lines: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
              },
              word: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    text: {
                      type: 'string',
                    },
                    showWhitespace: {
                      type: 'boolean',
                    },
                  },
                },
              },
              time: {
                type: 'number',
              },
            },
          },
        },
      },
    },
    modificationTime: {
      type: 'number',
    },
  },
  required: ['uri', 'src', 'title', 'author', 'duration', 'album', 'thumbSrc', 'thumbFileName'],
  // indexes: ['duration'],
};
