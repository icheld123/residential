import { HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../shared/service/data.service';
import { Identification } from '../../shared/models/identifications.model';
import { Employee } from '../../shared/models/employees.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Person } from '../../shared/models/person.model';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-reception-form',
  templateUrl: './reception-form.component.html',
  styleUrl: './reception-form.component.css'
})
export class ReceptionFormComponent {
  @ViewChild('ngSelect') ngSelect!: NgSelectComponent;
  public employeeNameControl = new FormControl();
  public filteredEmployees: Employee[] = [];
  public isActive!: string;
  public formAplicacion!: FormGroup;
  public searchControl = new FormControl();
  public mostrarForm: boolean = true;
  reqFieldName: string = "*Este campo es requerido";
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
  peopleLoading = false;

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
      personaDestino: new FormControl("", [Validators.required, Validators.minLength(6)]),
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
  get companyNameField() { return this.formAplicacion.get('companyName'); }
  get employeeNameField() { return this.formAplicacion.get('employeeName'); }
  get personaDestinoField() { return this.formAplicacion.get('personaDestino'); }
  get firstNameField() { return this.formAplicacion.get('firstName'); }
  get secondNameField() { return this.formAplicacion.get('secondName'); }
  get middleNameField() { return this.formAplicacion.get('middleName'); }
  get lastNameField() { return this.formAplicacion.get('lastName'); }
  get telefonoField() { return this.formAplicacion.get('telefono'); }
  get idNumberField() { return this.formAplicacion.get('idNumber'); }


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

  searchPersona(searchTerm: string) {
    this.dataService.getPersonById(this.userName, this.password, searchTerm).subscribe(data => {
      this.people = data;
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

  onSearch(event: { term: string; items: any[] }) {
    this.searchPersona(event.term);
    // Aquí puedes hacer cualquier validación o lógica que necesites
  }

  onClose(event: Event){
    this.people = [];
  }

  onSelect(selectedValue: any) {
    console.log('Valor seleccionado:', selectedValue);
    console.log("is valid: " + this.personaDestinoField!.valid)
    console.log("is requerid: " + this.personaDestinoField!.errors?.['required'])
    console.log(this.personaDestinoField)
    // Aquí puedes implementar la lógica adicional que necesites
  }
}
