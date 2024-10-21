import { Identification } from "./identifications.model";

export class Person{
    idNum: string;
    firstName: string;
    secondName?: string;
    firstLastName: string;
    secondLastName?: string;
    idTypeId: number;
    idNumber: string;
    phone: BigInt;
    email: string;
    idType: Identification;
}