export interface EventApiResponse {
  id: number;
  title: string; // Update to match the API field name
  description: string; // Match the API field name
  event_start_datetime: string; // Match the API field name and data type
  event_end_datetime: string; // Match the API field name and data type
  parent: unknown; // Match the API field name and data type
}
