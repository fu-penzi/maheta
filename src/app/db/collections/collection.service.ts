import {
  CollectionPopulationEnum,
  DocumentSelector,
} from '@src/app/db/collections/collection.model';

import { RxCollection, RxDocument } from 'rxdb';
import { concatMap, from, map, Observable, of, switchMap, take } from 'rxjs';

export abstract class CollectionService<CollectionDocument> {
  public collection: RxCollection;

  public getAll$(): Observable<CollectionDocument[]> {
    if (!this.collection) {
      return of([]);
    }
    return from(this.collection.find().exec()).pipe(
      take(1),
      map((documents: RxDocument[]) =>
        documents.map(
          (trackDocument: RxDocument) => trackDocument.toMutableJSON() as CollectionDocument
        )
      )
    );
  }

  public upsert$(documentItem: CollectionDocument): Observable<unknown> {
    return from(this.collection.upsert(documentItem));
  }

  public delete$(documentItem: CollectionDocument): Observable<boolean> {
    return this.getDocument$(documentItem).pipe(
      switchMap((document: RxDocument) => document.remove())
    );
  }

  public getPopulation$<Population>(
    documentItem: CollectionDocument,
    population: CollectionPopulationEnum
  ): Observable<Population[]> {
    return this.getDocument$(documentItem).pipe(
      concatMap((document: RxDocument) => from(document.populate(population)))
    );
  }

  public async isCollectionEmpty(): Promise<boolean> {
    return !(await this.collection.findOne().exec());
  }

  public getDocument$(documentItem: CollectionDocument): Observable<RxDocument> {
    const selector: DocumentSelector = this.getDocumentSelector(documentItem);
    return this.collection
      .findOne({
        selector,
      })
      .$.pipe(take(1));
  }

  private getDocumentSelector(documentItem: CollectionDocument): DocumentSelector {
    return 'uri' in documentItem
      ? {
          uri: (documentItem as any).uri,
        }
      : {
          id: (documentItem as any).id,
        };
  }
}
