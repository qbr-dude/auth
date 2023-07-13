import axios from 'axios';
import { createEffect, createStore, createEvent } from 'effector';
import { User } from '../model/user';

export const loginFx = createEffect<User, string, Error>(async ({ username, password }) => {
    try {
        const response = await axios.post('https://test-assignment.emphasoft.com/api/v1/login/', {
            "username": username,
            "password": password,
        });
        return response.data.token;
    } catch (error) {
        throw Error('No such username or password');
    }
})

export const $token = createStore<string | null>(null).on(loginFx.doneData, (state, payload) => payload);

loginFx.fail.watch(({ error, params }) => {
    throw error;
})

type UserForList = {
    id: number,
    username: string,
    firstName?: string,
}

export const fetchUsersFx = createEffect<User, UserForList[], Error>(async ({ username, password }) => {
    const response = await axios.get('https://test-assignment.emphasoft.com/api/v1/users/', {
        headers: {
            Authorization: `Token ${$token.getState()}`,
        }
    });
    return response.data.map(({ id, username, first_name }: { id: number, first_name: string, username: string }) => ({
        id,
        username,
        firstName: first_name,
    }));
})

export const sortUsers = createEvent<'asc' | 'desc'>();
export const clearUsers = createEvent();

export const $users = createStore<UserForList[]>([])
    .on(fetchUsersFx.doneData, (state, payload) => (
        [...state, ...payload]
    ))
    .on(sortUsers, (state, direction) => (
        direction === 'asc' ? state.sort((a, b) => a.id - b.id) : state.sort((a, b) => b.id - a.id)
    ))
    .reset(clearUsers);