import styled from "@emotion/styled";
import {useParams} from "react-router-dom";
import {FormProvider, useController, useFieldArray, useForm, useFormContext, useWatch} from "react-hook-form";
import ButtonGroup from "@mui/material/ButtonGroup";
import {Button, MenuItem, Select, Switch, TextField, Theme, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {Fragment, memo, useState} from "react";
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

export function TextInput({ name, ...rest }: { name: string } & TextFieldProps) {
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

function TextQuestionBlock({ name, withAnswers }: { name: string, withAnswers?: boolean }) {
    const { field } = useController({ name: `${name}.multiline` });
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({ name: `${name}.correctAnswers` });

    if (!fields.length) {
        append('');
    }

    console.log(`Render question block ${name}`);

    return <Bordered>
        <RowCenter>
            <span>Multiline: </span>
            <Switch {...field} />
        </RowCenter>
        <ColumnContainer style={{ gap: '8px' }}>
            {
                fields.map((key, idx) => <Fragment key={key.id}>
                    {
                        field.value
                            ? <TextInput name={`${name}.correctAnswers.${idx}`} variant='outlined' fullWidth maxRows={6} minRows={3} multiline={field.value} />
                            : <TextInput name={`${name}.correctAnswers.${idx}`} fullWidth />
                    }
                </Fragment>)
            }
            <button onClick={() => append('')}>+</button>
        </ColumnContainer>
    </Bordered>
}

function NumberQuestionBlock() {


    return <Bordered>
        Number
    </Bordered>
}

function SelectQuestionBlock() {
    return <Bordered>
        Select
    </Bordered>
}

const QuestionBlock = memo(function ({ name }: { name: string }) {
    const { register } = useFormContext();
    const { field } = useController({ name: `${name}.type` });

    console.log(`Render question ${name} ${field.value}`);

    return <QuestionCard>
        <Row>
            <TextInputRow label='Questions name:' name={`${name}.name`} />
            <Right>
                <span>Required: </span>
                <Switch {...register(`${name}.required`)} />
                <Select className='type-select' variant='standard'{...field}>
                    {
                        questionTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)
                    }
                </Select>
            </Right>
        </Row>
        {
            {
                text: <TextQuestionBlock name={name} />,
                number: <NumberQuestionBlock />,
                select: <SelectQuestionBlock />,
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
        console.log(form.getValues());
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
