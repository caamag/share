import { db } from '../firebase/config';

//firebase components
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from 'firebase/auth';

import { useEffect, useState } from 'react';


export const useAuthentication = () => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    //cleanUp
    const [cancel, setCancel] = useState(false);

    const auth = getAuth();

    function checkIfIsCanceled() {
        if (cancel) {
            return;
        }
    };

    async function createUser(data) {
        checkIfIsCanceled();
        setLoading(true);
        setError(null);

        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.pass
            )

            await updateProfile(user, {
                displayName: data.displayName
            })

            setLoading(false);
            return user;

        } catch (error) {
            console.log(error.message);

            let systemMessageError = '';
            if (error.message.includes('Password')) {
                systemMessageError = 'A senha precisa conter ao menos seis caracteres';
            } else if (error.message.includes('email-already')) {
                systemMessageError = 'Email já cadastrado';
            } else {
                systemMessageError = 'Ocorreu algum erro. Tente novamente mais tarde.'
            }
            setLoading(false);
            setError(systemMessageError);
        }
    };

    //login
    async function login(data) {
        checkIfIsCanceled();
        setLoading(true);
        setError(false);
        try {
            await signInWithEmailAndPassword(auth, data.email, data.pass);
            setLoading(false);
        } catch (error) {
            let systemMessageError = '';
            if (error.message.includes('invalid-credential')) {
                systemMessageError = 'Usuário não localizado.';
                console.log(error.message);
            } else if (error.message.includes("wrong-password")) {
                systemMessageError = 'Senha incorreta.';
                console.log(error.message);
            } else {
                systemMessageError = 'Erro ao logar, tente novamente';
                console.log(error.message);
            }
            setError(systemMessageError);
            setLoading(false);
        }
    }

    //logout
    function logOut() {
        checkIfIsCanceled();
        signOut(auth);
    }

    useEffect(() => {
        return () => setCancel(true);
    }, []);

    return {
        auth,
        createUser,
        error,
        loading,
        logOut,
        login
    }

}