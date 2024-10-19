import { Identification } from "./identifications.model";

export class Person{
    idNum: BigInt;
    firstName: string;
    secondName?: string;
    middleName?: string;
    lastName: string;
    idTypeId: number;
    idNumber: BigInt;
    phone: BigInt;
    email: string;
    idType: Identification;
}