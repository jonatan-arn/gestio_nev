import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QuerySnapshot,
} from '@angular/fire/firestore';
import { auditories } from '../models/BM_Auditories';
import { preguntaCreacio } from '../models/BM_PreguntaCreacio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuditoriesService {
  auditorias: Observable<auditories[]>;
  private auditoriaCollection: AngularFirestoreCollection<auditories>;

  constructor(public router: Router, private afs: AngularFirestore) {
    this.auditoriaCollection = this.afs.collection<auditories>('BM_Auditories');
    this.getAllAuditories();
  }
  private getAllAuditories() {
    this.auditorias = this.auditoriaCollection
      .snapshotChanges()
      .pipe(
        map((action) => action.map((a) => a.payload.doc.data() as auditories))
      );
  }
  onDelete(objecte: auditories): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.auditoriaCollection
          .doc(objecte.BM_id)
          .delete();
        resolve(result);
      } catch (err) {
        reject(err.message);
      }
    });
  }
  onSave(objecte: auditories): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = objecte.BM_id;
        const data = { ...objecte };
        const result = await this.auditoriaCollection.doc(id).set(data);
        resolve(result);
      } catch (err) {
        reject(err.message);
      }
    });
  }

  getAuditories() {
    const dataCollection: AngularFirestoreCollection<auditories> = this.afs.collection<auditories>(
      'BM_Auditories/'
    );
    return dataCollection;
  }

  put(objecte, colecio: string) {
    console.log('objecto insertado: ' + colecio);
    this.afs.collection(colecio).add(Object.assign({}, objecte));
  }

  get(collection, param, value) {
    const dataCollection = this.afs
      .collection(collection, (ref) => ref.where(param, '==', value))
      .get();
    return dataCollection;
  }

  checkIdPregunta(id) {
    const dataCollection: AngularFirestoreCollection<preguntaCreacio> = this.afs.collection<preguntaCreacio>(
      'BM_PreguntesCreades/',
      (ref) => ref.where('BM_id', '==', id)
    );
    return dataCollection.valueChanges();
  }

  getPreguntes(id) {
    const dataCollection: AngularFirestoreCollection<preguntaCreacio> = this.afs.collection<preguntaCreacio>(
      'BM_PreguntesCreades/',
      (ref) => ref.where('BM_auditoriaId', '==', id)
    );
    return dataCollection.valueChanges();
  }

  checkIdAuditoria(id) {
    const dataCollection: AngularFirestoreCollection<auditories> = this.afs.collection<auditories>(
      'BM_Auditories/',
      (ref) => ref.where('BM_id', '==', id)
    );

    return dataCollection.valueChanges();
  }

  deleteAuditoria(auditoria: auditories) {
    console.log('auditoria borrada');
    const dataCollection = this.get('BM_Auditories/', 'BM_id', auditoria.BM_id);
    this.delete(dataCollection, 'BM_Auditories');
  }

  deleteAll(auditoria: auditories) {
    const dataCollection = this.get('BM_Auditories/', 'BM_id', auditoria.BM_id);

    let dataPreg;
    dataPreg = this.get(
      'BM_PreguntesCreades/',
      'BM_auditoriaId',
      auditoria.BM_id
    );

    dataPreg.subscribe((res) => {
      res.docs.forEach((doc) => {
        const checkbox = this.get(
          'BM_Checkbox/',
          'BM_preguntaId',
          doc.data().BM_id
        );
        const radio = this.get('BM_Radio/', 'BM_preguntaId', doc.data().BM_id);
        const text = this.get('BM_Text/', 'BM_preguntaId', doc.data().BM_id);
        const numero = this.get(
          'BM_Numero/',
          'BM_preguntaId',
          doc.data().BM_id
        );
        const slider = this.get(
          'BM_Slider/',
          'BM_preguntaId',
          doc.data().BM_id
        );
        const smile = this.get('BM_Smile/', 'BM_preguntaId', doc.data().BM_id);
        const si_no = this.get('BM_SiNo/', 'BM_preguntaId', doc.data().BM_id);

        this.delete(checkbox, 'BM_Checkbox');
        this.delete(radio, 'BM_Radio');
        this.delete(text, 'BM_Text');
        this.delete(numero, 'BM_Numero');
        this.delete(slider, 'BM_Slider');
        this.delete(smile, 'BM_Smile');
        this.delete(si_no, 'BM_SiNo');
        this.delete(dataPreg, 'BM_PreguntesCreades');
      });
    });
    this.delete(dataCollection, 'BM_Auditories');
  }

  delete(dataCollection, collection) {
    dataCollection.subscribe((res) => {
      res.docs.forEach((element) => {
        this.afs
          .collection(collection)
          .doc(element.id)
          .delete()
          .then(() => {
            console.log('Borrado Correctament: ' + collection);
          })
          .catch((error) => {
            console.log('Errore al borrar');
          });
      });
    });
  }
}
