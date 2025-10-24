export interface Child {
    id?: number;
    patientId: number | null;
    lastName: string;
    firstName: string;
    birthDate: string;
    patronymicName: string | null;
    snils: string | null;
    docSeries: string | null;
    docNumber: string | null;
    polis: string | null;
}