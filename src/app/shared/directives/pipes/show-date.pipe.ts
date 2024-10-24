import {Pipe, PipeTransform } from "@angular/core"
import * as moment from "moment";

@Pipe({
    name: "showDate",
})
export class ShowDatePipe implements PipeTransform{
    constructor(){}

    transform(value: any, format: string) {
        return( value != null ? moment.utc(value).format(format): null);
    }
}