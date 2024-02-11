// Data type that encapsulates 
export type CRMEntry = { [key: string]: string };

export interface CRMTable {
  getRowById(id: string): Promise<CRMEntry | null>;
  getClientByPhone(phoneNumber: string): Promise<CRMEntry | null>;
  storeClientByPhone(phoneNumber: string, client: CRMEntry): Promise<CRMEntry | null>;
}

export interface ConnieCRMProvider {
  getTable(id: string): CRMTable;
  getDefaultTable(): CRMTable;
}