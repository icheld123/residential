import { Person } from "./person.model";
import { Unit } from "./unit.model";

export class Package{
    id: number;
    company: string;
    destinataryId: number;
    destinatary: Person;
    state: string;
    receptionDate: Date;
    unit: string;
    sector: string;
}