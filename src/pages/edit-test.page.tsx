import styled from "@emotion/styled";
import {useNavigate, useParams} from "react-router-dom";
import {FormProvider, useController, useFieldArray, useForm, useFormContext, useWatch} from "react-hook-form";
import {MenuItem, Select, Switch, TextField} from "@mui/material";
import {Fragment, memo, useCallback, useEffect} from "react";
import {FullSelectQuestion, questionTypes, Test} from "../models/test.model";
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
    const { register, setValue } = useFormContext();
    const { field } = useController({ name: `${name}.type` });

    const typeChange = useCallback(function(...event: unknown[]) {
        field.onChange(...event);
        if ((event[0] as any).target.value === 'number') {
            // console.log("??");
            // we need a default question block value for each type so answers are cleared and selections too
            // setValue(`${name}.integer`, true);
        }
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
        console.dir(form.getValues());
        const test = form.getValues();
        const ret = globalInjector.db.createTest({
            ...test,
            author: globalInjector.authService.user?.uid || '',
            createdAt: new Date(),
        });
        ret.then(val => {
            navigate('/');
            console.log(val);
        }).catch(console.log);
    }

    useEffect(() => {


        axios.get('https://cxsdgwcrklvyzwo5nihbivt7f40xphan.lambda-url.eu-north-1.on.aws/')
            .then(res => {
                console.log(res);
            })
            .catch(console.log)
            .finally(console.log);

        // https://i2kqg7ldh4nykaxqveoxdanyia0rclzf.lambda-url.us-east-1.on.aws
        /*try {
            const xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", 'https://i2kqg7ldh4nykaxqveoxdanyia0rclzf.lambda-url.us-east-1.on.aws', false ); // false for synchronous request
            xmlHttp.send( null );
            const d = xmlHttp.responseText;
            console.log(d);
        } catch (e) {
            console.log(e);
        }*/

        // load by <p>Hello { testId }</p>
        if (testId === '0') {
        }
        /*setTimeout(() => {
            form.reset({
                id: '0',
                title: 'edit',
                questions: [
                    {
                        type: "select",
                        multiple: true,
                        name: "",
                        options: [{name: "Option 1", answer: false}, {name: "Option 2", answer: false}],
                        required: false,
                    } as FullSelectQuestion<true>,
                ]
            } as Test<true>)
        }, 5000);*/
    }, [testId]);

    console.log('Render page');
    return <ColumnContainer>
        <EditTestForm>
            <FormProvider {...form}>
                <Title />

                <TextInputRow label='Title' name="title" />
                <TextInputRow label='Description' name="description" />
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
