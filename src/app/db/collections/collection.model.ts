import { PlaylistPopulationEnum } from '@src/app/db/domain/playlist';

type DocumentIndex = 'uri' | 'id';
export type DocumentSelector = Partial<Record<DocumentIndex, string>>;
export type CollectionPopulationEnum = PlaylistPopulationEnum;
