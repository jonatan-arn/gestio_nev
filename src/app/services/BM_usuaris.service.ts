import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { usuaris } from '../models/BM_usuaris';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UsuarisService {
  usuarisCollection: AngularFirestoreCollection;
  private usuarisArray: Observable<usuaris[]>;

  constructor(private afs: AngularFirestore) {
    this.usuarisCollection = this.afs.collection<usuaris>('BM_Usuaris');
  }
  getUsuaris() {
    return this.usuarisArray;
  }
  getUsuari(email: any) {
    let s = this.afs
      .collection<usuaris>('BM_usuaris/', (ref) =>
        ref.where('BM_user', '==', email)
      )
      .valueChanges();
    return s;
  }
}
