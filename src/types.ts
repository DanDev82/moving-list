export interface Item {
  id: string;
  name: string;
  box_id: string;
  created_at: string;
}

export interface Box {
  id: string;
  name: string;
  created_at: string;
  items?: Item[];
} 