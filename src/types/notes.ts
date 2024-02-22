/**
 * Data model for an agent-client call interaction.
 */
export interface InteractionData {
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
