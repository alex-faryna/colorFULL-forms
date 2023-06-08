import styled from "@emotion/styled";
import {useParams} from "react-router-dom";
import {FormProvider, useForm, useFormContext, useWatch} from "react-hook-form";
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
  
  display: flex;
  flex-direction: column;
`;


function Form<T>({ children, onSubmit }: { children: ReactNode[], onSubmit: (value: unknown) => void }) {
    const { handleSubmit } = useFormContext();

    console.log(`Render form`);
    return <form onSubmit={handleSubmit(onSubmit)}>
        { children }
    </form>
}

export function InputWrapper({ name, ...rest }: { name: string }) {
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

function EditTestPage() {
    const { testId } = useParams();
    const form = useForm({ defaultValues: { title: '', description: 'Lol' } })

    function submit(val: unknown): void {
        console.log(val);
    }

    console.log('Render page');
    return <ColumnContainer>
        <EditTestForm>
            <FormProvider {...form}>
                <p>Hello { testId }</p>
                <Title />
                <Form onSubmit={submit}>
                    <InputWrapper name="title" />
                    <InputWrapper name="description" />
                    <input type="submit" value="Submit" />
                </Form>
            </FormProvider>
        </EditTestForm>
    </ColumnContainer>
}

export default EditTestPage;
