import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, Outlet} from "react-router-dom";
import styled from 'styled-components';
import {RootState} from './store';
import {createQuizButtonVisibilityService} from "./utils/create-quiz-button-visible.util";

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
`;

function App() {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.tests);

    useEffect(() => {
        // dispatch(setLoading());
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
