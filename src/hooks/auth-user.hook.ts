import {User} from "firebase/auth";
import {useEffect, useState} from "react";
import AuthService from "../services/auth.service";

function useAuthUser(auth: AuthService) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.listenUser(user => setUser(user));

        return () => unsubscribe();
    }, [auth]);

    return user;
}

export default useAuthUser;
