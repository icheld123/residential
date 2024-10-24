import { Component } from '@angular/core';
import { Package } from '../../../../shared/models/package.model';
import { DataService } from '../../../../shared/service/data.service';
import { Router } from '@angular/router';

const headers =  ['ID', 'EMPRESA', 'FECHA','SECTOR', 'UNIDAD', 'DESTINATARIO', 'ESTADO', 'ACCIONES'];
const CARACTER_DIVISOR = "-";
const PACKAGES_PER_PAGE = 10;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  public packagesPerPages: number = PACKAGES_PER_PAGE;
  public currentPage: number  = 1;
  public totalPackages: number = 0;
  public tableHeaders = headers;
  packages: Package[] = [];
  userName: string = 'user';
  password: string = 'password';

  constructor(private dataService: DataService, private router: Router ){
    
  }

  ngOnInit(){
    this.getPackagesList(this.userName, this.password);

  }

  getPackagesList(user: string, password: string){
    this.dataService.getPackages(user, password, this.currentPage, this.packagesPerPages).subscribe(
      data => {
        this.packages = data.dataContent;
        this.totalPackages = data.numTotalElementos;
      },
      error => {
        console.error('Error al obtener datos:', error);
      }
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getPackagesList(this.userName, this.password);
  }

  deliverPackage(packageId: number){
    console.log(packageId)
    this.router.navigate([`paquetes/registro-entrega/${packageId}`]);
    console.log(`paquetes/registro-entrega/${packageId}`);
  }
}
