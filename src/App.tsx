import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, Outlet} from "react-router-dom";
import styled from 'styled-components';
import {RootState} from './store';
import {createQuizButtonVisibilityService} from "./services/create-quiz-button-visible.service";

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
        <Link to='/'>
            <span>Header</span>
        </Link>
        { showCreate && <Right>
            <Link to='tests/0/edit' onClick={callback}>Create quiz</Link>
        </Right> }
    </Row>
}

const Content = styled.div`
  overflow-y: auto;
  height: 100%;
`;

function App({ loadingUser = false }: { loadingUser?: boolean }) {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.tests);

    useEffect(() => {
        // dispatch(setLoading());
    }, []);

    return <>
        <Header />
        <Content>
            {
                !loadingUser && {
                    loading: <span>Loading</span>,
                    error: <span>Error</span>,
                    idle: <Outlet />
                }[state.loading]
            }
        </Content>
    </>
}

export default App;
