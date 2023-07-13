import React from 'react'
import { useStore, useStoreMap } from 'effector-react';
import { $error, $form, handleChange, submit } from './model';


type FieldProps = {
    name: string,
    type: 'text' | 'password',
    label: string,
}

const Field = ({ name, type, label }: FieldProps) => {
    const value = useStoreMap({
        store: $form,
        keys: [name],
        fn: values => values[name] || '',
    });
    return (
        <>
            <span className='indent-2 font-medium'>{label}</span>
            <input
                type={type}
                name={name}
                value={value}
                className='mb-2 p-2 bg-gray-200 rounded'
                onChange={handleChange}
                required
            />
        </>
    )
}

const Form = () => {
    const error = useStore($error);
    return (
        <form
            action="POST"
            className='flex flex-col w-full relative'
            onSubmit={submit}
        >
            <Field type='text' name='login' label='Username' />
            <Field type='password' name='password' label='Password' />
            <button className="flex-1 py-2 bg-gray-600 rounded mt-5 text-white" type="submit">Sign in</button>
            {error && <div className='absolute -bottom-6 text-red-600'>{error.message}</div>}
        </form>
    )
}

export default Form;