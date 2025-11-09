export interface IRepository {
    get(args: { key: string }): string;
    set(args: { key: string; value: string; session?: boolean }): void;
    delete?(args: { key: string }): void;
    renew?(args: { key: string; session?: boolean }): void;
}

