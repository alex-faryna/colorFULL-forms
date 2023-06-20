import {Link, useNavigate, useParams} from "react-router-dom";
import {Fragment, useEffect, useRef, useState} from "react";
import {ExtendedTest, FullSelectQuestion, Test} from "../models/test.model";
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

const ResultCard = styled.div`
  border-radius: 6px;
  width: 100%;
  border: 1px solid #ccc;
  padding: 1rem;
`;

const Tag = styled.span`
  border-radius: 3px;
  border: 1px solid #ccc;
  background: rgba(161, 253, 238, 0.6);
  padding: 4px 8px;
`;

function Result({ result, test }: { test: ExtendedTest<true>, result: { id: string, answers: string[] } & Record<string, unknown> }) {
    return <ResultCard>
        <p>{ result['email'] as string }</p>
        <br/>
        {
            test.questions.map((question, idx) => <div style={{ marginBottom: '10px' }} key={idx}>
                <span style={{ width: '100%', fontWeight: 'bold' }}>
                    { question.name }:
                </span>
                <br/>
                <span>
                    { (result.answers[idx] && question.type === 'select')
                        ? result.answers[idx].split('|').map(val => <Tag key={val}>{
                            (question as FullSelectQuestion).options[+val].name
                        }</Tag>)
                        : result.answers[idx] }
                </span>
            </div>)
        }
    </ResultCard>
}

export default function TestResultsPage() {
    const { testId } = useParams();
    const [results, setResults] = useState<({ id: string, answers: string[] } & Record<string, unknown>)[]>([]);
    const lastResult = useRef<QueryDocumentSnapshot>();
    const [test, setTest] = useState<ExtendedTest<true> | null>(null);

    useEffect(() => {
        if (testId) {
            globalInjector.db.getTest(testId)
                .then(val => setTest(val as ExtendedTest<true>))
                .catch(console.log);
            globalInjector.db.getStats(25, testId, lastResult.current)
                .then(([val, last]) => {
                    lastResult.current = last;
                    setResults(res => [...res, ...val as { id: string, answers: string[] }[]]);
                })
                .catch(console.log);
        }
    }, [testId]);

    return <ColumnContainer>
        <EditTestForm>
            <p>Results:</p>
            {
                !!test && results.map(result => <Result key={result.id} result={result} test={test}/>)
            }
        </EditTestForm>
    </ColumnContainer>
}
