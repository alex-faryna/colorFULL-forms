import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, Outlet} from "react-router-dom";
import styled from 'styled-components';
import {RootState} from './store';
import {createQuizButtonVisibilityService} from "./services/create-quiz-button-visible.service";
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'

const Row = styled.div`
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid #ccc; 
`;

const Right = styled.span`
  margin-left: auto;
  
  a {
    color: #777;  
  }
  
  a:hover {
    color: #555;
  }
`;


function Header() {
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        createQuizButtonVisibilityService.init(val => setShowCreate(!val));
    }, []);

    const callback = () => createQuizButtonVisibilityService.updateVisibility(true);

    return <Row>
        <span>Header</span>
        { showCreate && <Right>
            <Link to='tests/0/edit' onClick={callback}>Create quiz</Link>
        </Right> }
    </Row>
}

const Content = styled.div`
  overflow-y: auto;
  height: 100%;
`;

function App() {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.tests);

    useEffect(() => {
        // dispatch(setLoading());
    }, []);




    useEffect(() => {

        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const auth = getAuth();


        /*signInWithEmailAndPassword(auth, 'sasha.faryna1234@gmail.com', 'lol12345')
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                console.log(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log('err:');
                console.log(error);
            });*/


        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                const uid = user.uid;
                // ...

                console.log('---');
                console.log(user);
            } else {
                // User is signed out
                // ...

                console.log('not logged');
            }
        });
    }, []);



    console.log('render');
    return <>
        <Header />
        <Content>
            {
                {
                    loading: <span>Loading</span>,
                    error: <span>Error</span>,
                    idle: <Outlet />
                }[state.loading]
            }
        </Content>
    </>
}

export default App;
