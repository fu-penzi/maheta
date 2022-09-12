import { Playlist, PlaylistPopulationEnum } from '@src/app/db/domain/playlist.schema';
import { Track } from '@src/app/db/domain/track.schema';

type DocumentIndex = 'uri' | 'id';
export type DocumentSelector = Partial<Record<DocumentIndex, string>>;
export type CollectionDocument = Track | Playlist;
export type CollectionPopulationEnum = PlaylistPopulationEnum;
