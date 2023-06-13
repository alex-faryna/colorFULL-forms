import styled from "@emotion/styled";
import {useParams} from "react-router-dom";
import {FormProvider, useController, useFieldArray, useForm, useFormContext, useWatch} from "react-hook-form";
import ButtonGroup from "@mui/material/ButtonGroup";
import {Button, MenuItem, Select, Switch, TextField, Theme, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {Fragment, memo, useCallback, useEffect, useState} from "react";
import {questionTypes, Test} from "../models/test.model";
import {SxProps} from "@mui/system";
import {TextFieldProps} from "@mui/material/TextField/TextField";

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const EditTestForm = styled.div`
  max-width: 1000px;
  width: 50%;
  padding: 2rem;
  height: 100%;
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
    // console.log(`Render input ${name}`);
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
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({ name: `${name}.correctAnswers` });

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
            <button onClick={() => append('')}>+</button>
        </ColumnContainer>
    </Bordered>
}

// remove multiple answers from number question
function NumberQuestionBlock({ name }: { name: string }) {
    const { field } = useController({ name: `${name}.integer`, defaultValue: true });
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({ name: `${name}.correctAnswers` });

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
            <button onClick={() => append('')}>+</button>
        </ColumnContainer>
    </Bordered>
}

function SelectQuestionBlock({ name }: { name: string }) {
    const { getValues, setValue } = useFormContext();
    const { field } = useController({ name: `${name}.multiple`, defaultValue: true });
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({ name: `${name}.options` });
    const correctAnswers = useFieldArray({ name: `${name}.correctAnswers` });
    const correct: string[] = getValues(`${name}.correctAnswers`);
    const options = getValues(`${name}.options`);
    if (fields.length < 2) {
        append(['Option 1', 'Option 2'].slice(0, 2 - fields.length));
    }

    console.log(fields);
    console.log(`Render select block ${name}`);

    const addAnswer = (value: string) => {
        if (field.value) {
            correctAnswers.append(value);
        } else {
            correctAnswers.remove();
            correctAnswers.append(value);
        }
    }

    useEffect(() => {
        if (!field.value && correct?.length > 1) {
            console.log(correct);
            const c = correct
                .map(v => ({ value: v, idx: options.findIndex((e: string) => e === v) }))
                .sort((a , b) => a.idx - b.idx);
            correctAnswers.remove();
            correctAnswers.append(c[0].value);
        }
    }, [field.value]);


    // remove questions
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
                    <TextInput name={`${name}.options.${idx}`} fullWidth />
                    {
                        correct.includes(options[idx])
                            ? <button onClick={() => correctAnswers.remove(correct.indexOf(options[idx]))}>-</button>
                            : <button onClick={() => addAnswer(options[idx])}>+</button>
                    }
                </RowCenter>)
            }
            {
                fields.length < 5 && <button onClick={() => append('')}>+</button>
            }
        </ColumnContainer>
    </Bordered>
}

const QuestionBlock = memo(function ({ name }: { name: string }) {
    const { register, setValue } = useFormContext();
    const { field } = useController({ name: `${name}.type` });

    const typeChange = useCallback(function(...event: unknown[]) {
        field.onChange(...event);
        setValue(`${name}.correctAnswers`, []);
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
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        name: 'questions',
        rules: { minLength: 1 }
    })

    console.log('Render questions block');
    return <ColumnContainer style={{ gap: '16px' }}>
        {
            fields.map((key, idx) => <QuestionBlock key={key.id} name={`questions.${idx}`} />)
        }
        <button onClick={() => append({ type: 'text', name: '' })}>+</button>
    </ColumnContainer>
}

function EditTestPage() {
    const { testId } = useParams();
    const form = useForm<Test<true>>({ defaultValues: { title: '', questions: [], additional: { description: 'Lol' } } })

    const back = (): void => {
        console.dir(form.getValues().questions);
    }

    console.log('Render page');
    return <ColumnContainer>
        <EditTestForm>
            <FormProvider {...form}>
                <p>Hello { testId }</p>
                <Title />

                <TextInputRow label='Title' name="title" />
                <TextInputRow label='Description' name="additional.description" />

                <QuestionsBlock />

                <button onClick={back}>Finish</button>
            </FormProvider>
        </EditTestForm>
    </ColumnContainer>
}

export default EditTestPage;
