// Data type that encapsulates
export type CRMEntry = { [key: string]: string };

/**
 * A generic CRM table backing source.
 *
 * A CRM organizes and stores information about the customers of a business.
 * This interface treats phone numbers as unique identifiers for clients.
 */
export interface CRMTable {
  /**
   * Retrieves a row from the CRM table by the unique identifier.
   *
   * @param id The unique identifier of the row to retrieve. Note that this depends on the CRM table's implementation.
   */
  getRowById(id: string): Promise<CRMEntry | null>;
  getClientByPhone(phoneNumber: string): Promise<CRMEntry | null>;
  /**
   *
   * @param phoneNumber The phone number of the client.
   * @param client Data to store in the CRM.
   */
  storeClientByPhone(
    phoneNumber: string,
    client: CRMEntry,
  ): Promise<CRMEntry | null>;
  getAllRows(): Promise<CRMEntry[]>;
}

export interface ConnieCRMProvider {
  getTable(id: string): CRMTable;
  getDefaultTable(): CRMTable;
}
