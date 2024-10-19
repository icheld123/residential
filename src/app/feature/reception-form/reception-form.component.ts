import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../shared/service/data.service';
import { Identification } from '../../shared/models/identifications.model';
import { Employee } from '../../shared/models/employees.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Person } from '../../shared/models/person.model';

@Component({
  selector: 'app-reception-form',
  templateUrl: './reception-form.component.html',
  styleUrl: './reception-form.component.css'
})
export class ReceptionFormComponent {
  public employeeNameControl = new FormControl();
  public filteredEmployees: Employee[] = [];
  public isActive!: string;
  public formAplicacion!: FormGroup;
  public searchControl = new FormControl();
  public mostrarForm: boolean = true;
  reqFieldName: string = '';
  nameFieldValid: string = '';
  phoneFieldName: string = '';
  phoneFieldValid: string = '';
  emailFieldName: string = '';
  emailFieldValid: string = '';
  idNumberValid: string = '';
  selectedPersonaName: string = '';
  userName: string = 'user';
  password: string = 'password';
  identifications: Identification[] = [];
  employees: Employee[] = [];
  people: Person[] = [];

  constructor(private dataService: DataService){
    this.construirFormulario();
  }


  private limpiarFormulario(){
    this.formAplicacion.reset();
  }

  public construirFormulario(){
    this.formAplicacion = new FormGroup({
      companyName: new FormControl("", [Validators.required, Validators.minLength(6)]),
      employeeName: new FormControl("", [Validators.required, Validators.minLength(6)]),
      personaDestinoField: new FormControl("", [Validators.required, Validators.minLength(6)]),
      personaDestinoSearch: new FormControl("", []),
      firstName: new FormControl("", [Validators.required, Validators.minLength(6)]),
      secondName: new FormControl("", [Validators.required, Validators.minLength(6)]),
      middleName: new FormControl("", [Validators.required, Validators.minLength(6)]),
      lastName: new FormControl("", [Validators.required, Validators.minLength(6)]),
      telefonoField: new FormControl("", [Validators.required, Validators.minLength(6)]),
      idType: new FormControl(['', Validators.required]),
      idNumber: new FormControl("", [Validators.required, Validators.minLength(6)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      telefono: new FormControl("", [Validators.required, Validators.min(100000)]),
    });
  }

  get emailField() { return this.formAplicacion.get('email'); }
  get medioPreferidoField() { return this.formAplicacion.get('medioPreferido'); }
  get companyName() { return this.formAplicacion.get('companyName'); }
  get employeeName() { return this.formAplicacion.get('employeeName'); }
  get personaDestinoField() { return this.formAplicacion.get('personaDestinoField'); }
  get personaDestinoSearch() { return this.formAplicacion.get('personaDestinoSearch'); }
  get firstName() { return this.formAplicacion.get('firstName'); }
  get secondName() { return this.formAplicacion.get('secondName'); }
  get middleName() { return this.formAplicacion.get('middleName'); }
  get lastName() { return this.formAplicacion.get('lastName'); }
  get telefonoField() { return this.formAplicacion.get('telefono'); }
  get idNumber() { return this.formAplicacion.get('idNumber'); }


  ngOnInit(){
    this.construirFormulario();
    this.getIdTypeList(this.userName, this.password);
    this.getEmployees(this.userName, this.password);
    this.getPerson(this.userName, this.password)
  }

  getIdTypeList(user: string, password: string){
    this.dataService.getIdTypes(this.userName, this.password).subscribe(
      data => {
        this.identifications = data;
      },
      error => {
        console.error('Error al obtener datos:', error);
      }
    );
  }
  getEmployees(user: string, password: string){
    this.dataService.getEmployees(user, password).subscribe(
      (response) => {
        this.employees = response.map((employee: any) => ({
          identification: employee.numeroIdentificacion	,
          name: employee.persona.primerNombre,
          lastname: employee.persona.primerApellido,
        }));
      },
      (error) => {
        console.error('Error al cargar empleados', error);
      }
    );
  }

  getPerson(user: string, password: string){
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.dataService.getPersonById(user, password, value))
    )
    .subscribe(
      (response) => {
        this.people = response;
        console.log(this.people)
      },
      (error) => {
        console.error('Error al buscar personas', error);
      }
    );
  }

  searchPersona(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value.trim();
    console.log('buscando para: ', searchTerm);
    this.dataService.getPersonById(this.userName, this.password,searchTerm).subscribe(data => {
      this.people = data;
      console.log('personas cargadas:', this.people);
    });
  }

  onPersonaSelect(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const idNumber = BigInt(inputElement.value.trim());
    const selectedPerson = this.people.find(person => person.idNumber === idNumber);
    console.log('persona seleccionada:')
    if (selectedPerson) {
      this.selectedPersonaName = `${selectedPerson.firstName} ${selectedPerson.lastName}`;
      console.log('persona seleccionada:',this.selectedPersonaName)
    } else {
      this.selectedPersonaName = '';
    }
  }
  
}
