import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { auditories } from '../models/BM_Auditories';
import { preguntaCreacio } from '../models/BM_PreguntaCreacio';

@Injectable({
  providedIn: 'root',
})
export class AuditoriesService {
  constructor(public router: Router, private afs: AngularFirestore) {}
  private dia = [];

  getAuditories() {
    const dataCollection: AngularFirestoreCollection<auditories> = this.afs.collection<auditories>(
      'BM_Auditories/'
    );
    return dataCollection;
  }

  put(objecte, colecio: string) {
    this.afs.collection(colecio).add(Object.assign({}, objecte));
  }
  checkIdPregunta(id) {
    let s = this.afs.collection<preguntaCreacio>(
      'BM_PreguntesCreades/',
      (ref) => ref.where('BM_PreguntesCreades', '==', id)
    );
    s.get().toPromise();

    s.get().subscribe((res) => {
      if (res.empty) return false;
      else return true;
    });
  }
  add(auditoria: auditories) {
    /*   this.afs
      .collection('BM_Dies/')
      .doc(dia.id)
      .set({ BM_temperatura: dia.BM_temperatura }, { merge: true });
      */
  }
}
