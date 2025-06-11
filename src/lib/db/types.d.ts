import type { Database, Statement } from 'better-sqlite3';

export interface DatabaseWrapper {
    prepare: (sql: string) => Statement;
    exec: (sql: string) => void;
    transaction: <T>(cb: () => T) => T;
    get: <T>(sql: string, params?: any[]) => T | undefined;
    all: <T>(sql: string, params?: any[]) => T[];
    run: (sql: string, params?: any[]) => void;
} 