import classNames from 'classnames';
import React from 'react'

import { ReactComponent as CrossIcon } from './CrossIcon.svg';
import Form from '../form';

import { $modal, closeModal } from './model';
import { useStore } from 'effector-react';

const Modal = () => {
    const isActive = useStore($modal);
    return (
        <div className={classNames(
            'w-screen h-screen fixed justify-center items-center bg-gradient-to-tr from-blue-400 to bg-pink-400',
            { 'hidden': !isActive, 'flex': isActive }
        )}>
            <div className='h-96 w-96 bg-white flex flex-col items-center rounded-lg py-4 relative'>
                <span className='text-4xl font-medium my-5'>Sign in</span>
                <div className='flex items-center w-2/3 h-full'>
                    <Form />
                </div>
                <button className='absolute top-5 right-5' onClick={() => closeModal()}>
                    <CrossIcon width={24} height={24} />
                </button>
            </div>
        </div>
    )
}


export default Modal;