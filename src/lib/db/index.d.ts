declare module '$lib/db' {
  export interface Project {
    id: number;
    name: string;
    description: string;
    goal: number;
    image_url: string;
    created_at: string;
    updated_at: string;
  }

  export interface Donation {
    id: number;
    project_id: number;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    transaction_id: string;
    date: string;
  }

  export interface Database {
    get<T = any>(sql: string, params?: any[]): Promise<T>;
    all<T = any>(sql: string, params?: any[]): Promise<T[]>;
    run(sql: string, params?: any[]): Promise<void>;
  }

  export const db: Database;
} 