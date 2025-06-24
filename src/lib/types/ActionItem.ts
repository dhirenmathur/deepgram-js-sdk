export interface ActionItem {
  text: string;
  assigned_to?: number[];
  assigned_by?: number;
  confidence?: number;
  timestamp?: number;
  due_date?: string;
}
