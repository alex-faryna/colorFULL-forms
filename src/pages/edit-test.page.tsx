import styled from "@emotion/styled";
import {Link, useNavigate, useParams} from "react-router-dom";
import {FormProvider, useController, useFieldArray, useForm, useFormContext, useWatch} from "react-hook-form";
import {MenuItem, Select, Switch, TextField} from "@mui/material";
import {Fragment, memo, useCallback, useEffect} from "react";
import {FullSelectQuestion, questionTypes, stripObj, Test} from "../models/test.model";
import {TextFieldProps} from "@mui/material/TextField/TextField";
import axios from "axios";
import {globalInjector} from "../services/global-injector.service";

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

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Bold = styled.span`
  font-weight: 600;
`;

export function TextInput({ name, ...rest }: { name: string, step?: string } & TextFieldProps) {
    const { register } = useFormContext();
    return <TextField {...register(name)} variant="standard" {...rest} />;
}

function Title() {
    const val = useWatch({ name: 'title' });
    console.log('Render title');
    return <p>{ val }</p>
}

function TextInputRow({ label, name }: { label: string, name: string }) {
    return <InputRow>
        <Bold>{ label }</Bold>
        <TextInput name={name} />
    </InputRow>
}

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

const RowCenter = styled.div`
  display: flex;
  align-items: center;
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

function TextQuestionBlock({ name }: { name: string }) {
    const { field } = useController({ name: `${name}.multiline` });
    const { fields, append, move } = useFieldArray({ name: `${name}.correctAnswers` });

    console.log(`Render question block ${name}`);

    // make autofocus when adding answer to list
    function answer(key: string, idx: number, multiline: boolean) {
        return <Fragment key={key}>{
            multiline
                ? <TextInput name={`${name}.correctAnswers.${idx}`} variant='outlined' fullWidth maxRows={6} minRows={3} multiline={multiline} />
                : <TextInput name={`${name}.correctAnswers.${idx}`} fullWidth />
        }</Fragment>
    }

    return <Bordered>
        <RowCenter>
            <span>Multiline: </span>
            <Switch {...field} />
        </RowCenter>
        <ColumnContainer style={{ gap: '8px' }}>
            {
                fields.map((key, idx) => answer(key.id, idx, field.value))
            }
            {
                !!fields.length || <button onClick={() => append('')}>+</button>
            }
        </ColumnContainer>
    </Bordered>
}

// remove multiple answers from number question
function NumberQuestionBlock({ name }: { name: string }) {
    const { field } = useController({ name: `${name}.integer`, defaultValue: true });
    const { fields, append, move } = useFieldArray({ name: `${name}.correctAnswers` });

    console.log(`Render number block ${name}`);

    return <Bordered>
        <RowCenter>
            <span>Integer: </span>
            <Switch {...field} checked={field.value} />
        </RowCenter>
        <ColumnContainer style={{ gap: '8px' }}>
            {
                fields.map((key, idx) => <TextInput key={key.id} type='number'
                                                    name={`${name}.correctAnswers.${idx}`} fullWidth
                                                    InputProps={{
                                                        inputProps: {
                                                            step: 0.1
                                                        }
                                                    }}
                />)
            }
            {
                !!fields.length || <button onClick={() => append('')}>+</button>
            }
        </ColumnContainer>
    </Bordered>
}

function SelectQuestionBlock({ name }: { name: string }) {
    const { getValues, setValue } = useFormContext();
    const { field } = useController({ name: `${name}.multiple`, defaultValue: true });
    const { fields, append, remove, move, update } = useFieldArray({ name: `${name}.options` });
    const options: { name: string, answer?: boolean }[] = getValues(`${name}.options`);
    if (fields.length < 2) {
        append([
            { name: 'Option 1', answer: false },
            { name: 'Option 2', answer: false }
        ].slice(0, 2 - fields.length));
    }

    console.log(`Render select block ${name}`);

    const setOnlyAnswer = (idx: number) => {
        setValue(`${name}.options`, options.map((opt, i) => ({ ...opt, answer: i === idx })));
    }

    const addAnswer = (idx: number) => {
        if (field.value) {
            update(idx,  { ...options[idx], answer: true});
        } else {
            setOnlyAnswer(idx);
        }
    }

    useEffect(() => {
        if (!field.value) {
            const idx = options.findIndex(opt => opt?.answer);
            setOnlyAnswer(idx);
        }
    }, [field.value]);

    // reorder options
    // reorder questions
    return <Bordered>
        <RowCenter>
            <span>Multiple: </span>
            <Switch {...field} checked={field.value} />
        </RowCenter>
        <p>Options:</p>
        <ColumnContainer style={{ gap: '8px' }}>
            {
                fields.map((key, idx) => <RowCenter key={key.id} style={{ width: '100%', gap: '1rem' }}>
                    <button disabled={fields.length < 3} onClick={() => remove(idx)}>-</button>
                    <span>{ idx + 1 }</span>
                    <TextInput name={`${name}.options.${idx}.name`} fullWidth />
                    {
                        options[idx]?.answer
                            ? <button onClick={() => update(idx,  { ...options[idx], answer: false})}>-</button>
                            : <button onClick={() => addAnswer(idx)}>+</button>
                    }
                </RowCenter>)
            }
            {
                fields.length < 5 && <button onClick={() => append({ name: '', answer: false })}>+</button>
            }
        </ColumnContainer>
    </Bordered>
}

const QuestionBlock = memo(function ({ name, rem }: { name: string, rem: () => void }) {
    const { register, getValues, setValue } = useFormContext();
    const { field } = useController({ name: `${name}.type` });

    const typeChange = useCallback(function(...event: unknown[]) {
        field.onChange(...event);
        const val = getValues(name);
        setValue(name, {
            name: val.name,
            type: val.type,
            ...(val.required !== null && val.requied !== undefined && { required: val.required }),
        });
    }, [field.onChange]);

    console.log(`Render question ${name} ${field.value}`);

    return <QuestionCard>
        <Row>
            <TextInputRow label='Questions name:' name={`${name}.name`} />
            <Right>
                <span>Required: </span>
                <Switch {...register(`${name}.required`)} />
                <Select className='type-select' variant='standard' {...field} onChange={typeChange} >
                    {
                        questionTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)
                    }
                </Select>
                <button onClick={rem}>-</button>
            </Right>
        </Row>
        {
            {
                text: <TextQuestionBlock name={name} />,
                number: <NumberQuestionBlock name={name} />,
                select: <SelectQuestionBlock name={name} />,
            }[field.value as string]
        }
    </QuestionCard>
})

function QuestionsBlock() {
    const { fields, append, remove, move } = useFieldArray({
        name: 'questions',
        rules: { minLength: 1 }
    })

    console.log('Render questions block');
    return <ColumnContainer style={{ gap: '16px' }}>
        {
            fields.map((key, idx) => <QuestionBlock key={key.id} name={`questions.${idx}`} rem={() => remove(idx)} />)
        }
        {
            fields.length < 10 && <button onClick={() => append({ type: 'text', name: '' })}>+</button>
        }
    </ColumnContainer>
}

function EditTestPage() {
    const navigate = useNavigate();
    const { testId } = useParams();
    const form = useForm<Test<true>>({ defaultValues: { title: '', questions: [] } });

    const saveTest = (): void => {
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
    }

    useEffect(() => {
        if (testId) {
            globalInjector.db.getTest(testId)
                .then(test => form.reset(test.data()))
                .catch(console.log);

            // later make everyhting go through redux store so we avoid retreiving everything if w navigate from the strt screen
        }
    }, [testId]);

    console.log('Render page');
    return <ColumnContainer>
        <EditTestForm>
            <FormProvider {...form}>
                <Row>
                    <Title />
                    <Right>
                        <Link to='..' relative="path">
                            <span>View</span>
                        </Link>
                    </Right>
                </Row>

                <TextInputRow label='Title' name='title' />
                <TextInputRow label='Description' name='description' />
                {
                    // time to complete add
                }
                <QuestionsBlock />
                <div>
                    <button onClick={saveTest}>Finish</button>
                </div>
            </FormProvider>
        </EditTestForm>
    </ColumnContainer>
}

export default EditTestPage;
