export interface TodoModel{
    id: number;
    title: string;
    completeed: boolean;
    editing?: boolean;

}

export type FilterType = 'all' | 'active' | 'completed'