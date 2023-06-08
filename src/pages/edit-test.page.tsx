import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import {useParams} from "react-router-dom";
import {useForm, useWatch} from "react-hook-form";
import {
    ChangeEvent,
    Children,
    cloneElement, createContext,
    createElement,
    memo,
    ReactChildren, ReactNode,
    useCallback, useContext,
    useEffect,
    useState
} from "react";
import {ReactJSXElementChildrenAttribute} from "@emotion/react/types/jsx-namespace";

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

const FormContext = createContext({});

function Form({ children, onSubmit }: { children: ReactNode[], onSubmit?: any }) {
    const { handleSubmit } = useContext(FormContext) as any;

    console.log(`Render form`);
    return <form onSubmit={handleSubmit(onSubmit)}>
        { children }
    </form>
}

export function Input({ name, ...rest }: any) {
    const { register } = useContext(FormContext) as any;
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
    const { control } = useContext(FormContext) as any;
    const val = useWatch({ control, name: 'title' });
    console.log('Render title');
    return <p>{ val }</p>
}

function EditTestPage() {
    const { testId } = useParams();
    const form = useForm({ defaultValues: { title: '', description: 'Lol' } })

    function submit(val: unknown): void {
        console.log(val);
        console.log('!!');
    }

    console.log('Render page');
    return <ColumnContainer>
        <EditTestForm>
            <FormContext.Provider value={form}>
                <p>Hello { testId }</p>
                <Title />
                <Form onSubmit={submit}>
                    <Input name="title" />
                    <Input name="description" />
                    <input type="submit" value="Submit" />
                </Form>
            </FormContext.Provider>
        </EditTestForm>
    </ColumnContainer>
}

export default EditTestPage;
