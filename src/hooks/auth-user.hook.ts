import {User} from "firebase/auth";
import {useEffect, useState} from "react";
import AuthService from "../services/auth.service";

function useAuthUser(auth: AuthService): [User | null, boolean] {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.listenUser(user => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    return [user, loading];
}

export default useAuthUser;
