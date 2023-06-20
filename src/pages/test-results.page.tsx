import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {Test} from "../models/test.model";
import {globalInjector} from "../services/global-injector.service";
import {encode} from "../utils/secure.utils";
import {TextField} from "@mui/material";
import styled from "@emotion/styled";
import {QueryDocumentSnapshot} from "firebase/firestore";


const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  // height: 100%;
  align-items: center;
`;

const EditTestForm = styled.div`
  max-width: 1000px;
  width: 50%;
  padding: 2rem;
  // height: 100%;
  overflow-y: auto;
  
  display: flex;
  flex-direction: column;
  gap: 16px;
`;


export default function TestResultsPage() {
    const { testId } = useParams();
    const lastTest = useRef<QueryDocumentSnapshot>();

    useEffect(() => {
        if (testId) {
            globalInjector.db.getStats(25, testId, lastTest.current)
                .then(test => console.log(test))
                .catch(console.log);
        }
    }, [testId]);

    return <ColumnContainer>
        <EditTestForm>
            <p>Results:</p>
            { /*<TestContext.Provider value={(idx, value) => answers.current.answers[idx] = value}>
                <Row>
                    <Title>{ test.title }</Title>
                    <Right>
                        <Link to='edit'>
                            <span>Edit</span>
                        </Link>
                    </Right>
                </Row>
                <p>{ test.description }</p>
                <p>Enter email:</p>
                <TextField variant='standard' fullWidth onChange={val => answers.current.email = val.target.value} />
                <QuestionsBlock questions={test.questions}/>
                <div>
                    <button onClick={submit}>Submit</button>
                </div>
            </TestContext.Provider> */ }
        </EditTestForm>
    </ColumnContainer>
}
