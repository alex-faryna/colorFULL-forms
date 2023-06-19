import {Link, useNavigate, useParams} from "react-router-dom";
import {FormProvider, useController, useFieldArray, useForm, useFormContext} from "react-hook-form";
import {
    FullNumberQuestion,
    FullSelectQuestion,
    FullTextQuestion,
    Question,
    questionTypes,
    Test
} from "../models/test.model";
import {globalInjector} from "../services/global-injector.service";
import {Fragment, memo, useCallback, useEffect, useState} from "react";
import styled from "@emotion/styled";
import {MenuItem, Select, Switch, TextField} from "@mui/material";
import {TextInput} from "./edit-test.page";

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

const QuestionCard = styled.div`
  border-radius: 6px;
  width: 100%;
  border: 1px solid #ccc;
  padding: 1rem;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
`;

const Right = styled.div`
  margin-left: auto;
`;

const Bordered = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const RowCenter = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.span`
  font-weight: bold;
`;

const Option = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 6px 12px;

  &.selected {
    background: rgba(108, 202, 225, 0.4);
    border: 1px solid rgba(108, 202, 225, 0.4);
  }
`;

function TextQuestionBlock({ question }: { question: FullTextQuestion }) {
    return <ColumnContainer style={{ gap: '8px' }}>
        {
            question.multiline
                ? <TextField variant='outlined' fullWidth maxRows={6} minRows={3} multiline={true} />
                : <TextField fullWidth />
        }
    </ColumnContainer>
}

function NumberQuestionBlock({ question }: { question: FullNumberQuestion }) {
    return <ColumnContainer style={{ gap: '8px' }}>
        <TextField type='number'
                   fullWidth
                   InputProps={{
                       inputProps: {
                           step: 0.1
                       }
                   }}
        />
    </ColumnContainer>
}


function SelectQuestionBlock({ question }: { question: FullSelectQuestion }) {

    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

    const setOption = (val: number) => {
        if (!question.multiple)  {
            setSelectedOptions([val]);
            return;
        }

        const set = new Set([...selectedOptions, val]);
        if (selectedOptions.includes(val)) {
            set.delete(val);
        }
        const res = [...set];
        setSelectedOptions(res);
    }

    return <ColumnContainer style={{ gap: '8px', alignItems: 'flex-start' }}>
        <p>Select { question.multiple ? 'multiple' : 'one' }:</p>
        {
            question.options.map((option, idx) => <Option key={idx}
                                                          className={selectedOptions.includes(idx) ? 'selected' : ''}
                                                          onClick={() => setOption(idx)}>
                { option.name }
            </Option>)
        }
    </ColumnContainer>
}

const QuestionBlock = memo(function ({ question }: { question: Question<true> }) {

    return <QuestionCard>
        <Title>{ question.name }</Title>
        <Row>
            {
                {
                    text: <TextQuestionBlock question={question as FullTextQuestion} />,
                    number: <NumberQuestionBlock question={question as FullNumberQuestion} />,
                    select: <SelectQuestionBlock question={question as FullSelectQuestion} />,
                }[question.type]
            }
        </Row>
    </QuestionCard>
})


function QuestionsBlock({ questions }: { questions: Question<true>[] }) {
    return <ColumnContainer style={{ gap: '16px' }}>
        {
            questions.map((question, idx) => <QuestionBlock key={idx} question={question}/>)
        }
    </ColumnContainer>
}


export default function TestPage() {
    const navigate = useNavigate();
    const { testId } = useParams();
    const [test, setTest] = useState<Test<true>>();
    const form = useForm<Test<true>>({ defaultValues: { title: '', questions: [] } });

    /*const saveTest = (): void => {
        console.dir(form.getValues().questions);
        const test = form.getValues();
        const fullTest = {
            ...test,
            author: globalInjector.authService.user?.uid || '',
            createdAt: new Date(),
        };

        console.log(fullTest);
        const ret = testId
            ? globalInjector.db.updateTest({ ...fullTest, id: testId })
            : globalInjector.db.createTest(fullTest);
        ret.then(val => {
            navigate('/');
            console.log(val);
        }).catch(console.log);
    }*/

    useEffect(() => {
        if (testId) {
            globalInjector.db.getTest(testId)
                .then(test => setTest(test.data() as Test<true>)) //form.reset(test.data())
                .catch(console.log);
        }
    }, [testId]);

    if (!test) {
        return <ColumnContainer>
            <EditTestForm>
                <h3>Loading...</h3>
            </EditTestForm>
        </ColumnContainer>
    }

    return <ColumnContainer>
        <EditTestForm>
            <FormProvider {...form}>
                <Row>
                    <Title>{ test.title }</Title>
                    <Right>
                        <Link to='edit'>
                            <span>Edit</span>
                        </Link>
                    </Right>
                </Row>
                <p>{ test.description }</p>
                <QuestionsBlock questions={test.questions}/>
                <div>
                    <button>Finish</button>
                </div>
            </FormProvider>
        </EditTestForm>
    </ColumnContainer>
}
