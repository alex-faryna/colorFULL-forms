import styled from "@emotion/styled";
import {TextFieldProps} from "@mui/material/TextField/TextField";
import {FormProvider, useForm, useFormContext} from "react-hook-form";
import {TextField} from "@mui/material";
import {Test} from "../models/test.model";
import {globalInjector} from "../services/global-injector.service";
import {useNavigate} from "react-router-dom";

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

function TextInputRow({ label, name }: { label: string, name: string }) {
    return <InputRow>
        <Bold>{ label }</Bold>
        <TextInput name={name} />
    </InputRow>
}

export default function LoginPage() {
    const navigate = useNavigate();
    const form = useForm({ defaultValues: { login: '', password: '' } });

    const login = () => {
        const value = form.getValues();
        globalInjector.authService.signInWithEmail(value.login, value.password)
            .then(val => navigate('/'))
            .catch(() => console.log('Erorr loggin in'));
    }

    return <ColumnContainer>
        <EditTestForm>
            <FormProvider {...form}>
                <TextInputRow label='Login' name='login' />
                <TextInputRow label='Password' name='password' />

                <div>
                    <button onClick={login}>Finish</button>
                </div>
            </FormProvider>
        </EditTestForm>
    </ColumnContainer>
}
