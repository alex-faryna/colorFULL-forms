
export const questionTypes = ['text', 'number', 'select'] as const;
export type QuestionType = typeof questionTypes[number];

interface BaseQuestion {
    name: string;
    required?: boolean;
    type: QuestionType;
}

interface FullTextQuestion extends BaseQuestion{
    type: 'text';
    multiline?: boolean;
    correctAnswers: string[];
}

export interface FullNumberQuestion extends BaseQuestion {
    type: 'number';
    integer?: boolean;
    correctAnswers: number[];
}

export interface FullSelectQuestion<T extends boolean = false> extends BaseQuestion {
    type: 'select';
    multiple?: boolean; // for radio / checkboxes select
    options: (T extends false ? { name: string } : { name: string, answer?: boolean })[];
}

type FullQuestion<T extends boolean> = FullTextQuestion | FullNumberQuestion | FullSelectQuestion<T>;
export type Question<T extends boolean = false> = Omit<FullQuestion<T>, T extends false ? 'correctAnswers' : ''>;

export interface Test<T extends boolean = false> {
    id: string;
    title: string;
    withAnswers?: T; // if true, when we configure the test we add the answers, the answers are ALWAYS checked on the server
    questions: Question<T>[];
}
