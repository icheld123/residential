import { Person } from "./person.model";
import { Unit } from "./unit.model";

export class RecepcionForm{
    companyName: string;
    personId?: number;
    personDestinatary?: Person;
    unitDestinatary?: Unit;
    employeeId: number;
}