import { UnitValue, createEffect, createEvent, createStore, sample } from 'effector';
import { loginFx } from '../../api';
import { closeModal } from '../modal';
import { login } from './../../model/user';
import { restore } from 'effector';

type SetFieldPayload = {
    key: string,
    value: string,
}

export const submit = createEvent<React.FormEvent>();
const setField = createEvent<SetFieldPayload>();

const submitted = createEffect((values: UnitValue<typeof $form>) => {
    login({ username: values['login'], password: values['password'] });
    closeModal();
})

const validateFx = createEffect((values: UnitValue<typeof $form>) => {
    loginFx({ username: values['login'], password: values['password'] });
})

export const $form = createStore<{ [key: string]: string }>({}).on(setField, (state, { key, value }) => ({
    ...state,
    [key]: value,
}))

export const $error = restore(loginFx.failData, null).reset(submit);

sample({
    clock: submit,
    source: $form,
    target: validateFx,
})

sample({
    clock: loginFx.done,
    source: $form,
    target: submitted,
})

export const handleChange = setField.prepend<React.ChangeEvent<HTMLInputElement>>(({ currentTarget: { name, value } }) => ({
    key: name,
    value: value,
}))

submit.watch(e => {
    e.preventDefault();
})