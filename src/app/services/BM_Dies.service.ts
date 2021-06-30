import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { dies } from '../models/BM_Dies';
import { AngularFireModule } from '@angular/fire';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DiesService {
  constructor(public router: Router, private afs: AngularFirestore) {}
  private dia = [];

  getDiesByNevera_Fecha(id: any, dia: any) {
    const dataCollection: AngularFirestoreCollection<dies> =
      this.afs.collection<dies>('BM_Dies/', (ref) =>
        ref.where('BM_idNevera', '==', id).where('BM_dia', '==', dia)
      );

    return dataCollection;
  }

  addDia(dia: dies): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = dia.BM_id || this.afs.createId();
        const data = { ...dia };
        const result = await this.afs.collection('BM_Dies/').doc(id).set(data);
        resolve(result);
      } catch (err) {
        reject(err.message);
      }
    });
  }
}
