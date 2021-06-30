import { Injectable } from '@angular/core';
import { nevera } from '../models/BM_Nevera';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class NeveraService {
  constructor(private afs: AngularFirestore) {}

  getNeveresbyLocalitat(idLocalitat: any) {
    const dataCollection: AngularFirestoreCollection<nevera> =
      this.afs.collection<nevera>('BM_Nevera/', (ref) =>
        ref.where('BM_idLocalitat', '==', idLocalitat)
      );
    return dataCollection;
  }
}
