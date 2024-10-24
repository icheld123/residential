import { Component } from '@angular/core';
import { DataService } from '../../../../shared/service/data.service';
import { NgToastService } from 'ng-angular-popup';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Identification } from '../../../../shared/models/identifications.model';
import { Employee } from '../../../../shared/models/employees.model';
import { Person } from '../../../../shared/models/person.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delivery-form',
  templateUrl: './delivery-form.component.html',
  styleUrl: './delivery-form.component.css'
})
export class DeliveryFormComponent {
  public formAplicacion!: FormGroup;
  public mostrarForm: boolean = true;
  currentPage = 1;
  identifications: Identification[] = [];
  employees: Employee[] = [];
  people: Person[] = [];
  userName: string = 'user';
  password: string = 'password';
  reqFieldName: string = "*Este campo es requerido";
  nameFieldValid: string = '';
  phoneFieldName: string = '';
  phoneFieldValid: string = '';
  emailFieldName: string = '';
  emailFieldValid: string = '';
  idNumberValid: string = '';
  selectedPersonaName: string = '';
  selectedEmployeeId: number | null = null;
  peopleLoading = false;
  employeesLoading = false;
  packageId: number | null = null;
  

  constructor(private dataService: DataService, private toast: NgToastService, private route: ActivatedRoute){
    this.construirFormulario();
  }

  ngOnInit(){
    this.construirFormulario();
    this.getIdTypeList(this.userName, this.password);
    // this.getEmployees(this.userName, this.password);
    // this.getPerson(this.userName, this.password)
    // this.eventListener();
    this.route.params.subscribe(params => {
      this.packageId = +params['id'];
      console.log('Paquete a entregar:', this.packageId);
    });
    console.log(this.packageId)
  }

  private limpiarFormulario(){
    this.formAplicacion.reset();
  }

  public construirFormulario(){
    this.formAplicacion = new FormGroup({
      companyName: new FormControl("", [Validators.required, Validators.minLength(3)]),
      employeeName: new FormControl("", [Validators.required, Validators.minLength(3)]),
      personaDestino: new FormControl("", [Validators.required, Validators.minLength(3)]),
      firstName: new FormControl("", []),
      secondName: new FormControl("", []),
      middleName: new FormControl("", []),
      lastName: new FormControl("", []),
      telefonoField: new FormControl("", []),
      idType: new FormControl('', []),
      idNumber: new FormControl("", []),
      email: new FormControl("", []),
      telefono: new FormControl("", []),
      destinataryExists: new FormControl(true, Validators.required),
      sectorDestinatary: new FormControl('', Validators.required),
      unitDestinatary: new FormControl('', Validators.required)
    });
  }


  updateFieldValidators(exists: boolean) {
    if (!exists) {
      // Si el destinatario NO existe
      this.firstNameField!.setValidators([Validators.required, Validators.minLength(6)]);
      this.middleNameField!.setValidators([Validators.required, Validators.minLength(6)]);
      this.idNumberField!.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(10)]);
      this.telefonoField!.setValidators([Validators.required, Validators.min(100000)]);
      this.emailField!.setValidators([Validators.required, Validators.email]);
    } else {
      this.firstNameField!.clearValidators();
      this.middleNameField!.clearValidators();
      this.idNumberField!.clearValidators();
      this.telefonoField!.clearValidators();
      this.emailField!.clearValidators();
    }
    this.firstNameField!.updateValueAndValidity();
    this.middleNameField!.updateValueAndValidity();
    this.idNumberField!.updateValueAndValidity();
    this.telefonoField!.updateValueAndValidity();
    this.emailField!.updateValueAndValidity();
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
  get destinataryExistsField() { return this.formAplicacion.get('destinataryExists'); }
  get sectorDestinataryField() { return this.formAplicacion.get('sectorDestinatary'); }
  get unitDestinataryField() { return this.formAplicacion.get('unitDestinatary'); }

  getIdTypeList(user: string, password: string){
    this.dataService.getIdTypes(user, password).subscribe(
      data => {
        this.identifications = data;
      },
      error => {
        console.error('Error al obtener datos:', error);
      }
    );
  }

  searchPersona(searchTerm: string) {
    this.dataService.getPersonById(this.userName, this.password, searchTerm).subscribe(data => {
      this.people = data;
    });
  }

  searchEmployee(searchTerm: string) {
    this.dataService.getPersonById(this.userName, this.password, searchTerm).subscribe(data => {
      this.employees = data;
    });
  }

  onPersonaSelect(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const idNumber = inputElement.value.trim();
    const selectedPerson = this.people.find(person => person.idNumber === idNumber);
    console.log('persona seleccionada:')
    if (selectedPerson) {
      this.selectedPersonaName = `${selectedPerson.firstName} ${selectedPerson.firstLastName}`;
      console.log('persona seleccionada:',this.selectedPersonaName)
    } else {
      this.selectedPersonaName = '';
    }
  }

  onSearchPerson(event: { term: string; items: any[] }) {
    this.searchPersona(event.term);
  }

  onSearchEmployee(event: { term: string; items: any[] }) {
    const identificacion = event.term;
    this.employeesLoading = true;
    this.dataService.getEmployeesById(this.userName, this.password, identificacion).subscribe(
      (employees: Employee[]) => {
        this.employees = employees;
        this.employeesLoading = false;
      },
      error => {
        console.error('Error al obtener empleados:', error);
        this.employeesLoading = false;
      }
    );
  }
  

  onClosePerson(event: Event){
    this.people = [];
  }

  onSelectEmployee(event: Employee | undefined): void {
    if (event) {
      this.selectedEmployeeId = event.employeeId;
      console.log('Empleado seleccionado con ID:', this.selectedEmployeeId);
    } else {
      this.selectedEmployeeId = null;
      console.log('No se ha seleccionado ningún empleado');
    }
    console.log("is valid: " + this.employeeNameField!.valid)
    console.log("is requerid: " + this.employeeNameField!.errors?.['required'])
    console.log(this.employeeNameField)
  }

  onCloseEmployee(event: Event){
    this.employees = [];
  }

  onSelectPerson(selectedValue: any) {
    console.log('Valor seleccionado:', selectedValue);
    console.log("is valid: " + this.personaDestinoField!.valid)
    console.log("is requerid: " + this.personaDestinoField!.errors?.['required'])
    console.log(this.personaDestinoField)
  }

  goToNextPage() {
    if (this.currentPage < 3) {
      this.currentPage++;
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  buildReceptionObject(): any {
    const formValue = this.formAplicacion.value;

    const receptionObj = {
      empresa: formValue.companyName,
      personaDestinoId: formValue.personaDestino.idNum,
      personaDestino: {
        primerNombre: formValue.firstName,
        segundoNombre: formValue.secondName,
        primerApellido: formValue.middleName,
        segundoApellido: formValue.lastName,
        tipoIdentificacionId: formValue.idType,
        numeroIdentificacion: formValue.idNumber,
        telefono: formValue.telefono,
        correo: formValue.email
      },
      unidadDestino: {
        valorSector: formValue.sectorDestinatary,
        valorUnidad: formValue.unitDestinatary,
      },
      empleadoRecibeId: this.selectedEmployeeId,
    };

    return receptionObj;
  }

  onSubmit(): void {
    const receptionData = this.buildReceptionObject();
    this.dataService.sendReceptionForm(this.userName, this.password, receptionData).subscribe(
      (response) => {
        this.toast.success("La recepción ha sido registrada con éxito", "Registro guardado", 8000);
        this.formAplicacion.reset();
      },
      (error) => {
        this.toast.danger("Error al registrar la recepción", error);
      }
    );
  }
  
}
