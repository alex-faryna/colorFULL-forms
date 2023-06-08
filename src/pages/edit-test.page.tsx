import styled from "@emotion/styled";
import {useParams} from "react-router-dom";
import {FormProvider, useFieldArray, useForm, useFormContext, useWatch} from "react-hook-form";
import {ReactNode} from "react";

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const EditTestForm = styled.div`
  max-width: 2000px;
  width: 70%;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  
  display: flex;
  flex-direction: column;
`;

export function TextInput({ name, ...rest }: { name: string }) {
    const { register } = useFormContext();
    console.log(`Render input ${name}`);
    return <input {...register(name)} {...rest} />
}

/* export function Select({ register, options, name, ...rest }: any) {
    return (
        <select {...register(name)} {...rest}>
            {options.map((value: any) => (
                <option key={value} value={value}>
                    {value}
                </option>
            ))}
        </select>
    )
} */

function Title() {
    const val = useWatch({ name: 'title' });
    console.log('Render title');
    return <p>{ val }</p>
}

function TextInputRow({ label, name }: { label: string, name: string }) {
    return <div>
        <p>{ label }</p>
        <TextInput name={name} />
    </div>
}

function QuestionBlock() {

}

function QuestionsBlock() {
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        name: 'questions',
        rules: { minLength: 1 }
    })

    console.log('Render questions block');
    return <ColumnContainer>
        {
            fields.map(field => <span key={field.id}>{ field.id }</span>)
        }
        <button onClick={() => append(3)}>+</button>
    </ColumnContainer>
}

function EditTestPage() {
    const { testId } = useParams();
    const form = useForm({ defaultValues: { title: '', questions: [], additional: { description: 'Lol' } } })

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
