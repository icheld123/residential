import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NgOptionHighlightModule } from "@ng-select/ng-option-highlight";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgToastModule } from "ng-angular-popup";
import { ShowDatePipe } from "./directives/pipes/show-date.pipe";


@NgModule({
    declarations: [ShowDatePipe],
    exports: [
        ReactiveFormsModule,
        CommonModule,
        NgSelectModule,
        NgOptionHighlightModule,
        NgToastModule,
        ShowDatePipe
      ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        NgSelectModule,
        NgOptionHighlightModule,
        NgToastModule
        
    ],
    providers: [],
    bootstrap: []
  })
  export class SharedModule { }
  