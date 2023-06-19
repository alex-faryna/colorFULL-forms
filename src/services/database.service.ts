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
    Timestamp
} from "firebase/firestore";
import {FirebaseApp} from "firebase/app";
import {ExtendedTest, Test} from "../models/test.model";

export default class DatabaseService {
    private readonly _db: Firestore;

    private get db() {
        return this._db;
    }

    constructor(app: FirebaseApp) {
        this._db = getFirestore(app);
    }

    getTestsList(skip: number, count: number, author: string) {
        const docs = query(
            collection(this.db, "tests"),
            where("author", "==", author),
            orderBy("createdAt", 'desc'),
            limit(count)
        );
        return getDocs(docs).then(val => val.docs.map(doc => {
            return ({
                ...doc.data(),
                id: doc.id,
                createdAt: (doc.data()['createdAt'] as Timestamp).toDate()
            }) as ExtendedTest;
        }));
    }

    getTest(id: string) {
        return getDoc(doc(this.db, `tests/${id}`));
    }

    updateTest(test: ExtendedTest<true>) {
        const q = doc(this.db, 'tests', test.id);
        return updateDoc(q, { ...test });
    }

    createTest(test: ExtendedTest<true>): Promise<DocumentReference<DocumentData>> {
        const collectionRef = collection(this.db, 'tests');
        return addDoc(collectionRef, test);
    }
}
