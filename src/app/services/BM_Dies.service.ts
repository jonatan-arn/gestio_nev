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
  constructor(
    public router: Router,
    private afs: AngularFirestore,
    private fire: AngularFireModule
  ) {}
  private dia = [];

  getDiesByNevera_Fecha(id: any, dia: any) {
    const dataCollection: AngularFirestoreCollection<dies> = this.afs.collection<dies>(
      'BM_Dies/',
      (ref) => ref.where('BM_idNevera', '==', id).where('BM_dia', '==', dia)
    );

    return dataCollection;
  }

  put(dia) {}
  addDia(dia: dies) {
    if (dia.id == '0') {
      this.afs.collection('BM_Dies/').add(dia);
    } else {
      this.afs
        .collection('BM_Dies/')
        .doc(dia.id)
        .set({ BM_temperatura: dia.BM_temperatura }, { merge: true });
    }
  }
  prov(id: any, dia: any) {
    let s = this.afs.collection<dies>('BM_Dies/', (ref) =>
      ref.where('BM_idNevera', '==', id).where('BM_dia', '==', dia)
    );
    s.get().subscribe((ss) => {
      ss.docs.forEach((doc) => {
        this.dia.push(doc.data().BM_dia);
        this.dia.push(doc.id);
      });
    });
  }
}
