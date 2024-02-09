export interface NoteData {
  id: string;
  clientId: string;
  author: string;
  callDate: string;
  callDuration?: string;
  dateCreated: string;
  dateUpdated: string;
  content: string;
  labels?: string[];
}
