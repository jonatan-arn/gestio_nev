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
import { smile } from '../models/BM_smile';
import { numero } from '../models/BM_numero';
import { si_no } from '../models/BM_si_no';
import { radio } from '../models/BM_Radio';
import { checkbox } from '../models/BM_checkbox';
import { slider } from '../models/BM_slider';
import { text } from '../models/BM_text';

@Injectable({
  providedIn: 'root',
})
export class AuditoriesService {
  auditoria: auditories;
  auditorias: Observable<auditories[]>;
  preguntes: Observable<preguntaCreacio[]>;
  checkbox: Observable<checkbox[]>;
  radio: Observable<radio[]>;
  siNo: Observable<si_no[]>;
  numero: Observable<numero[]>;
  slider: Observable<slider[]>;
  smile: Observable<smile[]>;
  text: Observable<text[]>;

  private auditoriaCollection: AngularFirestoreCollection<auditories>;

  constructor(public router: Router, private afs: AngularFirestore) {
    this.auditoriaCollection = this.afs.collection<auditories>('BM_Auditories');
    this.getAllAuditories();
    this.getAllCheckbox();
    this.getAllPreguntes();
    this.getAllRadio();
    this.getAllSiNo();
    this.getAllNumero();
    this.getAllSlider();
    this.getAllSmile();
    this.getAllText();
  }
  setAuditoria(auditoria: auditories) {
    this.auditoria = auditoria;
  }
  getAuditoria(): auditories {
    return this.auditoria;
  }
  private getAllAuditories() {
    this.auditorias = this.afs
      .collection<auditories>('BM_Auditories')
      .snapshotChanges()
      .pipe(
        map((action) => action.map((a) => a.payload.doc.data() as auditories))
      );
  }

  private getAllPreguntes() {
    this.preguntes = this.afs
      .collection<preguntaCreacio>('BM_PreguntesCreades')
      .snapshotChanges()
      .pipe(
        map((action) =>
          action.map((a) => a.payload.doc.data() as preguntaCreacio)
        )
      );
  }
  private getAllCheckbox() {
    this.checkbox = this.afs
      .collection<checkbox>('BM_Checkbox')
      .snapshotChanges()
      .pipe(
        map((action) => action.map((a) => a.payload.doc.data() as checkbox))
      );
  }
  private getAllRadio() {
    this.radio = this.afs
      .collection<radio>('BM_Radio')
      .snapshotChanges()
      .pipe(map((action) => action.map((a) => a.payload.doc.data() as radio)));
  }
  private getAllSiNo() {
    this.siNo = this.afs
      .collection<si_no>('BM_SiNo')
      .snapshotChanges()
      .pipe(map((action) => action.map((a) => a.payload.doc.data() as si_no)));
  }
  private getAllNumero() {
    this.numero = this.afs
      .collection<numero>('BM_Numero')
      .snapshotChanges()
      .pipe(map((action) => action.map((a) => a.payload.doc.data() as numero)));
  }
  private getAllSlider() {
    this.slider = this.afs
      .collection<slider>('BM_Slider')
      .snapshotChanges()
      .pipe(map((action) => action.map((a) => a.payload.doc.data() as slider)));
  }
  private getAllSmile() {
    this.smile = this.afs
      .collection<smile>('BM_Smile')
      .snapshotChanges()
      .pipe(map((action) => action.map((a) => a.payload.doc.data() as smile)));
  }

  private getAllText() {
    this.text = this.afs
      .collection<text>('BM_Text')
      .snapshotChanges()
      .pipe(map((action) => action.map((a) => a.payload.doc.data() as text)));
  }

  onDelete(id: string, collection: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('objecte id:' + id);
        console.log('colleccio:' + collection);
        const result = await this.afs.collection(collection).doc(id).delete();
        resolve(result);
      } catch (err) {
        reject(err.message);
      }
    });
  }
  onSave(objecte, collection: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = objecte.BM_id;
        const data = { ...objecte };
        const result = await this.afs.collection(collection).doc(id).set(data);
        resolve(result);
      } catch (err) {
        reject(err.message);
      }
    });
  }

  async checkIdPregunta(id) {
    try {
      const dataCollection: AngularFirestoreCollection<preguntaCreacio> = this.afs.collection<preguntaCreacio>(
        'BM_PreguntesCreades/',
        (ref) => ref.where('BM_id', '==', id)
      );
      return dataCollection.valueChanges();
    } catch (err) {
      return err;
    }
  }

  getPreguntesbyIdAudutoria(id) {
    const dataCollection: AngularFirestoreCollection<preguntaCreacio> = this.afs.collection<preguntaCreacio>(
      'BM_PreguntesCreades/',
      (ref) => ref.where('BM_auditoriaId', '==', id)
    );
    return dataCollection.valueChanges();
  }

  async checkIdAuditoria(id) {
    try {
      const result = await this.afs.collection<auditories>(
        'BM_Auditories/',
        (ref) => ref.where('BM_id', '==', id)
      );
      return result.valueChanges();
    } catch (err) {
      return err;
    }
  }
}
