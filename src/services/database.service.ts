import {
    addDoc,
    collection,
    DocumentData,
    DocumentReference,
    Firestore,
    getFirestore,
    getDoc,
    where,
    query,
    getDocs,
    limit,
    orderBy,
    Timestamp
} from "firebase/firestore";
import {FirebaseApp} from "firebase/app";
import {Test} from "../models/test.model";

export default class DatabaseService {
    private readonly _db: Firestore;

    private get db() {
        return this._db;
    }

    constructor(app: FirebaseApp) {
        this._db = getFirestore(app);
    }

    testsList(skip: number, count: number, author: string) {
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
            }) as Test;
        }));
    }

    createTest(test: Test<true>): Promise<DocumentReference<DocumentData>> {
        const collectionRef = collection(this.db, 'tests');
        return addDoc(collectionRef, test);
    }
}
