import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Employee } from '../models/employees.model';
import { Person } from '../models/person.model';
import { Sector } from '../models/sector.model';

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


  getEmployeesById(username: string, password: string, identificacion: string): Observable<any> {
    const token = btoa(`${username}:${password}`);
    
    const headers = new HttpHeaders({
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(this.apiUrl+'/empleado/obtener-por-tipo-e-id/1/'+identificacion, { headers }).pipe(
      map(response => this.mapResponseToEmployee(response))
    );
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

  getSectors(username: string, password: string): Observable<Sector[]> {
    const token = btoa(`${username}:${password}`);
  
    const headers = new HttpHeaders({
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.get<string[]>(this.apiUrl + '/unidad/obtener-sectores', { headers })
      .pipe(
        map(response => {
          // Mapeamos cada string a un objeto Sector
          return response.map(item => ({
            id: item
          }));
        })
      );
  }

  getUnits(username: string, password: string,sector: string): Observable<any> {
    const token = btoa(`${username}:${password}`);
    
    const headers = new HttpHeaders({
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(this.apiUrl+'/unidad/obtener-unidades/'+sector, { headers });
  }

  private mapResponseToPerson(data: any[]): Person[] {
    return data.map(item => {
      return {
        idNum: item.id,
        firstName: item.primerNombre,
        secondName: item.segundoNombre,
        firstLastName: item.primerApellido,
        secondLastName: item.segundoApellido, 
        idTypeId: item.tipoIdentificacionId,
        idNumber: item.numeroIdentificacion,
        phone: BigInt(item.telefono),
        email: item.correo,
        idType: item.tipoIdentificacion
      } as Person;
    });
  }

  private mapResponseToEmployee(data: any[]): Employee[] {
    return data.map(item => {
      return {
        employeeId: item.tipoEmpleadoId,
        identification: item.persona.numeroIdentificacion,
        name: `${item.persona.primerNombre} ${item.persona.segundoNombre}`,
        lastname: `${item.persona.primerApellido} ${item.persona.segundoApellido}`
      } as Employee;
    });
  }

  sendReceptionForm(username: string, password: string,data: any): Observable<any> {
    const token = btoa(`${username}:${password}`);
    
    const headers = new HttpHeaders({
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl+'/recepcion/registrar', data, { headers });
  }
  
}
