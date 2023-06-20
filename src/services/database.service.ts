import {
    addDoc,
    collection,
    DocumentData,
    DocumentReference,
    Firestore,
    getFirestore,
    getDoc,
    where,
    updateDoc,
    query,
    getDocs,
    limit,
    doc,
    orderBy,
    startAfter,
    deleteDoc,
    Timestamp,
    QueryConstraint,
    QueryDocumentSnapshot
} from "firebase/firestore";
import {FirebaseApp} from "firebase/app";
import {ExtendedTest, Test} from "../models/test.model";
import {decodeResults, decodeTest} from "../utils/secure.utils";

export default class DatabaseService {
    private readonly _db: Firestore;

    private get db() {
        return this._db;
    }

    constructor(app: FirebaseApp) {
        this._db = getFirestore(app);
    }

    getTestsList(count: number, author: string, skip: unknown = null): Promise<[ExtendedTest[], QueryDocumentSnapshot]> {
        const docs = query(
            collection(this.db, "tests"),
            ...[where("author", "==", author),
                orderBy("createdAt", 'desc'),
                skip ? startAfter(skip) : null,
                limit(count)].filter(Boolean) as QueryConstraint[]
        );
        return getDocs(docs).then(val => [
            val.docs.map(doc => {
                return (decodeTest({
                    ...doc.data() as ExtendedTest,
                    id: doc.id,
                    createdAt: (doc.data()['createdAt'] as Timestamp).toDate(),
                })) as ExtendedTest;
            }),
            val.docs[val.docs.length - 1]
        ]);
    }

    getStats(count: number, testId: string, skip: unknown = null) {
        const docs = query(
            collection(this.db, "results"),
            ...[where("testId", "==", testId),
                orderBy("createdAt", 'desc'),
                skip ? startAfter(skip) : null,
                limit(count)].filter(Boolean) as QueryConstraint[]
        );
        return getDocs(docs).then(val => [
            val.docs.map(doc => {
                return (decodeResults({
                    answers: [],
                    ...doc.data(),
                    id: doc.id,
                    createdAt: (doc.data()['createdAt'] as Timestamp).toDate(),
                }));
            }),
            val.docs[val.docs.length - 1]
        ]);
    }

    getTest(id: string) {
        return getDoc(doc(this.db, `tests/${id}`)).then(test => decodeTest(test.data() as ExtendedTest));
    }

    updateTest(test: ExtendedTest<true>) {
        const q = doc(this.db, 'tests', test.id);
        return updateDoc(q, { ...test });
    }

    createTest(test: ExtendedTest<true>): Promise<DocumentReference<DocumentData>> {
        const collectionRef = collection(this.db, 'tests');
        return addDoc(collectionRef, test);
    }

    saveResult(results: { testId: string, email: string, answers: string[], createdAt: Date }) {
        const collectionRef = collection(this.db, 'results');
        return addDoc(collectionRef, results);
    }

    deleteTest(test: ExtendedTest<true>) {
        console.log(test.id);
        const q = doc(this.db, 'tests', test.id);
        return deleteDoc(q);
    }
}
