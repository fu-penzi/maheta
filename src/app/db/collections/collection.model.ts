import { PlaylistPopulationEnum } from '@src/app/db/domain/playlist.schema';

type DocumentIndex = 'uri' | 'id';
export type DocumentSelector = Partial<Record<DocumentIndex, string>>;
export type CollectionPopulationEnum = PlaylistPopulationEnum;
