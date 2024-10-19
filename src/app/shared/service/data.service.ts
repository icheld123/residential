import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Employee } from '../models/employees.model';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://192.168.1.13:8082/bh';

  constructor(private http: HttpClient) {}

  getIdTypes(username: string, password: string): Observable<any> {
    const token = btoa(`${username}:${password}`);
    
    const headers = new HttpHeaders({
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any[]>(this.apiUrl + '/tipo-identificacion/obtener-todo', { headers })
    .pipe(
      map(response => {
        return response.map(item => ({
          id: item.id,
          idType: item.tipo,
          nombre: item.descripcion
        }));
      })
    );
  }

  getEmployees(username: string, password: string): Observable<any> {
    const token = btoa(`${username}:${password}`);
    
    const headers = new HttpHeaders({
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(this.apiUrl+'/empleado/obtener-por-tipo/1', { headers });
  }

  getPersonById(username: string, password: string, identificacion: string): Observable<any> {
    const token = btoa(`${username}:${password}`);
    
    const headers = new HttpHeaders({
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`${this.apiUrl}/persona/obtener-por-identificacion/${identificacion}`, { headers })
    .pipe(
      map(response => this.mapResponseToPerson(response))
    );
  }

  private mapResponseToPerson(data: any[]): Person[] {
    return data.map(item => {
      return {
        idNum: BigInt(item.id), // Asegúrate de que BigInt sea compatible
        firstName: item.primerNombre,
        secondName: item.segundoNombre,
        middleName: item.segundoApellido,
        lastName: item.primerApellido,
        idTypeId: item.tipoIdentificacionId,
        idNumber: BigInt(item.numeroIdentificacion),
        phone: BigInt(item.telefono), // Si BigInt no funciona, podrías usar number
        email: item.correo,
        idType: item.tipoIdentificacion // Asegúrate de que esto esté correctamente mapeado
      } as Person;
    });
  }
}
