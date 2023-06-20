import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {Test} from "../models/test.model";
import {globalInjector} from "../services/global-injector.service";
import {encode} from "../utils/secure.utils";
import {TextField} from "@mui/material";
import styled from "@emotion/styled";


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
    const navigate = useNavigate();
    const { testId } = useParams();
    const [test, setTest] = useState<Test<true>>();
    const answers = useRef<{ email: string, answers: Record<string, unknown> }>({
        email: '',
        answers: { }
    });

    useEffect(() => {
        if (testId) {
            globalInjector.db.getTest(testId)
                .then(test => setTest(test as Test<true>))
                .catch(console.log);
        }
    }, [testId]);

    const submit = () => {
        console.log(test);
        console.log(answers.current);

        const encodedAnswers = Object.values(answers.current.answers).map(answer => {
            if (typeof answer === 'string') {
                return encode(answer as string, globalInjector.authService.key);
            } else {
                return encode((answer as number[]).join('|'), globalInjector.authService.key);
            }
        });
        console.log(encodedAnswers);

        globalInjector.db.saveResult({ ...answers.current, answers: encodedAnswers })
            .then(console.log)
            .catch(console.log);
    }

    if (!test) {
        return <ColumnContainer>
            <EditTestForm>
                <h3>Loading...</h3>
            </EditTestForm>
        </ColumnContainer>
    }

    return <ColumnContainer>
        <EditTestForm>
            stats
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
