import { createEvent, createStore, forward } from 'effector';
import { clearUsers } from '../api';

export const login = createEvent<User>();
export const logout = createEvent();

forward({
    from: logout,
    to: clearUsers
})

export type User = {
    username?: string,
    password?: string,
}

export const $user = createStore<User | null>(null)
    .on(login, (state, payload) => payload)
    .on(logout, (state) => null);