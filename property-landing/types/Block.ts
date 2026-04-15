
import { Property } from "./property";

export interface Block {
  id: number;
  name: string;
  comment?: string;
  company: number;
  company_name: string;
  properties?: Property[];
}
