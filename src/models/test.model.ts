

export type QuestionTypes = 'text' | 'number' | 'select';
// elect with possibility of ading new values
// also list ? where you can add multiple values (kinda text but formatted better)

export interface BaseQuestion {
    title: string;
    required?: boolean;
    type: QuestionTypes;
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

export interface FullSelectQuestion extends BaseQuestion {
    type: 'select';
    multiple?: boolean; // for radio / checkboxes
    other?: boolean;
    choices: QuestionsChoice[];
    correctAnswers: number[];
}

export interface QuestionsChoice {
    id: number,
    text: string;
}

type FullQuestion = FullTextQuestion | FullNumberQuestion | FullSelectQuestion;
export type Question<T extends boolean = false> = Omit<FullQuestion, T extends false ? 'correctAnswers' : ''>;


export interface Test<T extends boolean = false> {
    id: string;
    title: string;
    withAnswers?: T; // if true, when we configure the test we add the answers, the answers are ALWAYS checked on the server
    questions: Question<T>[];
}
