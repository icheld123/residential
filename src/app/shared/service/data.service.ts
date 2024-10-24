import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Employee } from '../models/employees.model';
import { Person } from '../models/person.model';
import { Sector } from '../models/sector.model';
import { Package } from '../models/package.model';

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

  getPackages(username: string, password: string, page: number, amountPackages: number): Observable<any> {
    const token = btoa(`${username}:${password}`);
  
    const headers = new HttpHeaders({
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.get<any>(`${this.apiUrl}/recepcion/listar-paginado/${page}/${amountPackages}`, { headers })
      .pipe(
        map(response => {
          return {
            numTotalElementos: response.numTotalElementos, // Captura el total de elementos para la paginación
            dataContent: response.dataContent.map((item: any) => ({
              id: item.id,
              company: item.empresa,
              destinataryId: item.destinatarioId,
              destinatary: {
                idNum: item.destinatario.id,
                firstName: item.destinatario.primerNombre,
                secondName: item.destinatario.segundoNombre,
                firstLastName: item.destinatario.primerApellido,
                secondLastName: item.destinatario.segundoApellido,
                idTypeId: item.destinatario.tipoIdentificacionId,
                idNumber: item.destinatario.numeroIdentificacion,
                phone: item.destinatario.telefono,
                email: item.destinatario.correo,
                idType: {
                  id: item.destinatario.tipoIdentificacion.id,
                  idType: item.destinatario.tipoIdentificacion.tipo,
                  nombre: item.destinatario.tipoIdentificacion.descripcion,
                }
              },
              state: item.estado,
              receptionDate: new Date(item.fechaRecepcion),
              unit: item.unidad.unidad.codigo + item.unidad.valorUnidad,
              sector: item.unidad.sector.codigo + item.unidad.valorSector,
            }))
          };
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
