import { Injectable } from '@angular/core';
import { localitat } from '../models/BM_Localitat';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class LocalitatService {
  constructor(private afs: AngularFirestore) {}

  getLocalitat(idLocalitat: any) {
    const dataCollection: AngularFirestoreCollection<localitat> = this.afs.collection<localitat>(
      'BM_Localitat/',
      (ref) => ref.where('BM_ID', '==', idLocalitat)
    );
    return dataCollection.valueChanges();
  }
}
