

export type QuestionTypes = 'text' | 'radio' | 'checkbox' | 'number' | 'float' | 'select';
// elect with possibility of ading new values
// also list ? where you can add multiple values (kinda text but formatted better)

export interface Question {
    title: string;
    required?: boolean;
    type: QuestionTypes;
}

export interface Test {
    id: number;
    title: string;
    questions: Question[];
}
