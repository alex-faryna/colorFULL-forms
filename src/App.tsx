import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Outlet} from "react-router-dom";
import styled from 'styled-components';
import {RootState} from './store';

const Row = styled.div`
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid #ccc; 
`;

function Header() {

    return <Row>
        Header
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
