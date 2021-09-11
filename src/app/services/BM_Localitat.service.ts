import { Injectable } from '@angular/core';
import { localitat } from '../models/BM_Localitat';
import { map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalitatService {
  localitat: Observable<localitat[]>;

  constructor(private afs: AngularFirestore) {
    this.getAll();
  }

  getLocalitat(idLocalitat: any) {
    const dataCollection: AngularFirestoreCollection<localitat> =
      this.afs.collection<localitat>('BM_Localitat/', (ref) =>
        ref.where('BM_ID', '==', idLocalitat)
      );
    return dataCollection.valueChanges();
  }
  getLocalitat2(idLocalitat: any) {
    const dataCollection = this.afs
      .collection<localitat>('BM_Localitat/', (ref) =>
        ref.where('BM_ID', '==', idLocalitat)
      )
      .get();
    return dataCollection.toPromise();
  }
  getAll() {
    const localitat = this.afs
      .collection<localitat>('BM_Localitat')
      .snapshotChanges();
    return localitat;
  }
}
