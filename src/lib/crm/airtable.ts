import { CRMEntry, CRMTable, ConnieCRMProvider } from "./types";

const AIRTABLE_API_BASE: string =
  process.env.AIRTABLE_API_BASE || "https://api.airtable.com/v0";

export class AirtableCRMTable implements CRMTable {
  constructor(
    private baseId: string,
    private tableId: string,
    private token: string,
  ) {}

  /**
   * Makes a call to the Airtable API.
   * @param url - The URL to make the API call to.
   * @param headers - The headers to include in the API call.
   * @param method - The HTTP method to use for the API call. Defaults to "GET".
   * @param body - The request body to include in the API call.
   * @returns A Promise that resolves to the API response.
   */
  makeAirtableCall(
    url: string,
    headers: Record<string, string>,
    method?: string,
    body?: any,
  ): Promise<Response> {
    return fetch(url, {
      method: method || "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${this.token}`,
        "Content-Type": body ? "application/json" : "",
      },
      body: JSON.stringify(body),
    });
  }

  async parseSingleCrmEntry(
    response: Response,
    mayHaveMultipleRecords: boolean,
  ): Promise<CRMEntry | null> {
    const data = await response.json();
    let record;
    if (mayHaveMultipleRecords) {
      // check if records was empty
      if (data.records.length === 0) {
        return null;
      }

      // return the first record by converting it into a CRMEntry
      // We take its id and fields and return it as a CRMEntry
      record = data.records[0];
    } else {
      record = data;
    }
    return {
      id: record.id,
      ...record.fields,
    };
  }

  async getAllRows(): Promise<CRMEntry[]> {
    const airtableUrl = `${AIRTABLE_API_BASE}/${this.baseId}/${this.tableId}`;

    const response = await this.makeAirtableCall(airtableUrl, {}, "GET");

    // check for error code
    if (response.status !== 200) {
      throw new Error(
        `Error fetching data from airtable: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.records.map((record: any) => {
      return {
        id: record.id,
        ...record.fields,
      };
    });
  }

  async getRowById(recordId: string): Promise<CRMEntry | null> {
    const airtableUrl = `${AIRTABLE_API_BASE}/${this.baseId}/${this.tableId}/${recordId}`;

    const response = await this.makeAirtableCall(airtableUrl, {}, "GET");

    // check for error code
    if (response.status !== 200) {
      throw new Error(
        `Error fetching data from airtable: ${response.status} - ${response.statusText}`,
      );
    }

    return this.parseSingleCrmEntry(response, false);
  }

  /**
   * Retrieves a client from Airtable based on their phone number.
   * @param phoneNumber - The phone number of the client.
   * @returns A Promise that resolves to a CRMEntry object representing the client, or null if not found.
   * @see {@link https://airtable.com/developers/web/api/list-records}
   */
  async getClientByPhone(phoneNumber: string): Promise<CRMEntry | null> {
    // do a fetch from airtable API
    const filterFormula: string = `Phone=\"${AirtableCRMTable.formatPhoneNumber(phoneNumber)}\"`;
    const encodedFormula: string = encodeURIComponent(filterFormula);
    const airtableUrl: string = `${AIRTABLE_API_BASE}/${this.baseId}/${this.tableId}?filterByFormula=${encodedFormula}`;

    const response = await this.makeAirtableCall(airtableUrl, {}, "GET");
    if (response.status !== 200) {
      throw new Error(
        `Error fetching data from airtable: ${response.status} - ${response.statusText}`,
      );
    }
    return this.parseSingleCrmEntry(response, true);
  }

  /**
   * Stores a client in Airtable using their phone number as the identifier.
   * If the client already has an ID, it updates the existing record.
   * If the client does not have an ID, it throws an error indicating that adding a new record is required.
   * @param phoneNumber - The phone number of the client.
   * @param client - The CRM entry representing the client.
   * @returns A Promise that resolves to the updated CRM entry if successful, or null if the client does not have an ID.
   * @throws An error if there is an issue updating the data in Airtable or if adding a new record is required.
   */
  async storeClientByPhone(
    phoneNumber: string,
    client: CRMEntry,
  ): Promise<CRMEntry | null> {
    const existing = await this.getClientByPhone(phoneNumber);
    if (!existing) {
      throw new Error(
        "Still under implementation - adding a new record to Airtable.",
      );
    }

    // merge the two objects
    const merged = { ...existing, ...client };

    const airtableUrl = `${AIRTABLE_API_BASE}/${this.baseId}/${this.tableId}/${client.id}`;

    // remove id and RECORD_ID if they are in the CRM entry
    delete merged.id;
    delete merged.RECORD_ID;

    const fields = { ...merged };
    const dataObj = { fields };
    const response = await this.makeAirtableCall(
      airtableUrl,
      {},
      "PATCH",
      dataObj,
    );
    if (response.status !== 200) {
      throw new Error(
        `Error updating data in airtable: ${response.status} - ${response.statusText}`,
      );
    }

    return this.parseSingleCrmEntry(response, false);
  }

  // helper converts a string number into this format (123) 456-7890
  static formatPhoneNumber(phoneNumber: string): string {
    // first remove all non-numeric characters
    phoneNumber = phoneNumber.replace(/\D/g, "");
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  }
}

export class AirtableCRMProvider implements ConnieCRMProvider {
  constructor(
    private baseId: string,
    private token: string,
  ) {}
  getDefaultTable(): CRMTable {
    return new AirtableCRMTable(this.baseId, "clients", this.token);
  }

  getTable(table_id: string): CRMTable {
    return new AirtableCRMTable(this.baseId, table_id, this.token);
  }
}

export function s3KeyForAirtableToken(oktaId: string): string {
  return `crm_airtable_token:${oktaId}`;
}

export function s3KeyForAirtableBase(oktaId: string): string {
  return `crm_airtable_base:${oktaId}`;
}

export function s3KeyForAirtableTable(oktaId: string): string {
  return `crm_airtable_table:${oktaId}`;
}
