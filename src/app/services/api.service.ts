import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sistema } from '../models/sistema';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // url: string = 'http://172.40.3.14:9706/apis/';
  url: string = 'http://localhost:3000/apis/';

  constructor(private http: HttpClient) { }

  /**
   * Obtener los sistema en base de datos
   * @returns
   */
  getSistema(): Observable<Sistema[]> {
    const headers = { 'content-type': 'application/json' };
    let direccion = this.url + 'sistema';
    return this.http.get<Sistema[]>(direccion);
  }

  /**
   * Actualiza el sistema
   * @param formData datos actualizados del sistema
   * @param id del sistema a actualizar
   * @returns
   */
  updateSistema(formData: any, id: number) {
    const headers = { 'content-type': 'application/json' };
    let direccion = this.url + 'sistema/' + id;
    return this.http.put(direccion, formData);
  }

  /**
   * Guarda un nuevo producto
   * @param formData datos del producto
   * @returns
   */
  addSistema(formData: any) {
    const headers = { 'content-type': 'application/json' };
    let direccion = this.url + 'sistema';
    return this.http.post(direccion, formData);
  }

  /**
   * Elimina un producto
   * @param id producto a eliminar
   * @returns
   */
  deleteSistema(id:number) {
    let direccion = this.url + 'sistema/' + id.toString();
    const headers = { 'content-type': 'application/json' };
    return this.http.delete(direccion);
  }

}