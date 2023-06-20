import { AES, enc } from 'crypto-js';
import {
    EncodedFullSelectQuestion, ExtendedTest,
    FullNumberQuestion,
    FullSelectQuestion,
    FullTextQuestion,
    Question,
    Test
} from "../models/test.model";
import {globalInjector} from "../services/global-injector.service";

export function encode(msg: string, key: string): string {
    return AES.encrypt(msg, key).toString();
}

export function decode(msg: string, key: string): string {
    const bytes = AES.decrypt(msg, key);
    return bytes.toString(enc.Utf8);
}

export function encodeQuestionAnswers(question: FullTextQuestion): FullTextQuestion {
    const answers = question.correctAnswers;
    if (!answers.length) {
        return question;
    }
    return {
        ...question,
        correctAnswers: answers.slice(0, 1).map(answer => encode(answer, globalInjector.authService.key))
    }
}

export function encodeSelectQuestion(question: FullSelectQuestion<true>): EncodedFullSelectQuestion {
    return {
        ...question,
        multiple: encode(question.multiple ? 'true' : 'false', globalInjector.authService.key),
        options: question.options.map(option => ({ ...option, answer: encode(option.answer ? 'true' : 'false', globalInjector.authService.key) })),
    }
}

export function encodeQuestion(question: Question<true>): Question<true> {
    if (question.type === 'select') {
        return encodeSelectQuestion(question as FullSelectQuestion<true>);
    }
    return encodeQuestionAnswers(question as FullTextQuestion);
}

export function encodeTest(test: ExtendedTest<true>): ExtendedTest<true> {
    return {
        ...test,
        questions: test.questions.map(question => encodeQuestion(question)),
    }
}

export function decodeQuestionAnswers(question: FullTextQuestion): FullTextQuestion {
    const answers = question.correctAnswers;
    if (!answers.length) {
        return question;
    }
    return {
        ...question,
        correctAnswers: answers.slice(0, 1).map(answer => decode(answer, globalInjector.authService.key))
    }
}

export function decodeSelectQuestion(question: EncodedFullSelectQuestion): FullSelectQuestion<true> {
    return {
        ...question,
        multiple: decode(question.multiple, globalInjector.authService.key) === 'true',
        options: question.options.map(option => ({ ...option, answer: decode(option.answer, globalInjector.authService.key) === 'true' })),
    }
}

export function decodeQuestion(question: Question<true>): Question<true> {
    if (question.type === 'select') {
        return decodeSelectQuestion(question as EncodedFullSelectQuestion);
    }
    return decodeQuestionAnswers(question as FullTextQuestion);
}

export function decodeTest(test: ExtendedTest): ExtendedTest {
    return {
        ...test,
        questions: test.questions.map(question => decodeQuestion(question)),
    }
}

export function decodeResults(obj: { answers: string[] } & Record<string, unknown>): { answers: string[] } {
    return {
        ...obj,
        answers: obj.answers.map(answer => decode(answer, globalInjector.authService.key)),
    }
}
