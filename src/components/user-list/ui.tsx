import { createGate, useGate, useStore, useStoreMap } from 'effector-react';
import { EventPayload } from 'effector';
import React, { useState, useRef } from 'react'
import { fetchUsersFx, $users, $token, sortUsers } from './../../api';
import { $user } from '../../model/user';
import classNames from 'classnames';
import { useClickOutside } from './../../utils/useClickOutside';

import { ReactComponent as ArrowUpIcon } from './arr-up.svg';
import { ReactComponent as ArrowDownIcon } from './arr-down.svg';

type Props = {}

const userGate = createGate('fetch-users', $token.defaultState);
userGate.state.watch((state) => {
    if (typeof state === 'string') { // default state is {}, condition for avoid this
        fetchUsersFx($user.getState()!);
    }
})

const Loading = () => (
    <div>Loading</div>
)

const List = () => {
    const [sortDirection, setSortDirection] = useState<EventPayload<typeof sortUsers>>('asc');
    const [isActiveInput, setIsActiveInput] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);
    const user = useStore($user);
    useClickOutside(inputRef, () => setIsActiveInput(false));
    const handleDirChange = () => {
        const newDir = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newDir);
        sortUsers(newDir);
    };
    const [filter, setFilter] = useState('');
    const users = useStoreMap({
        store: $users,
        keys: [filter, sortDirection],
        fn: (state, keys) => {
            if (filter === '') {
                return state;
            } else {
                return state.filter(user => user.username.startsWith(filter));
            }
        }
    });
    return (
        <div className='table w-full grid-rows-1'>
            <div className='table-header-group'>
                <div className='table-row'>
                    <div
                        className={classNames(
                            'py-2 cursor-pointer transition-colors grow-0 border-r table-cell text-center',
                            { 'hover:bg-pink-200': sortDirection === 'asc', 'hover:bg-blue-200': sortDirection === 'desc' }
                        )} title='Sort'
                        onClick={handleDirChange}
                    >
                        <span className='text-xl font-medium'>Id</span>
                        <div className='inline-block ml-2 -mb-1'>
                            {sortDirection === 'asc' && <ArrowDownIcon width={24} height={24} />}
                            {sortDirection === 'desc' && <ArrowUpIcon width={24} height={24} />}
                        </div>
                    </div>
                    <div
                        className={classNames(
                            'grow border-r table-cell text-center',
                            { 'py-2': !isActiveInput, 'py-0': isActiveInput }
                        )}
                        onClick={() => setIsActiveInput(true)}
                        ref={inputRef}
                    >
                        {!isActiveInput
                            ? <span className='text-xl font-medium'>Username</span>
                            : <input
                                type="text"
                                placeholder='Filter username'
                                className={classNames(
                                    'p-2 rounded-md',
                                    { 'bg-pink-200': sortDirection === 'asc', 'bg-blue-200': sortDirection === 'desc' }
                                )}
                                value={filter}
                                onChange={e => setFilter(e.currentTarget.value)}
                            />
                        }
                    </div>
                    <div className='flex-1 py-2 table-cell text-center'>
                        <span className='text-xl font-medium'>First Name</span>
                    </div>
                </div>
            </div>
            <div className='table-row-group'>
                {users.length
                    ? users.map(({ id, username, firstName }) => (
                        <div key={id} className='table-row'>
                            <div className='p-3 border table-cell'>{id}</div>
                            <div className='p-3 border table-cell'>{username}</div>
                            <div className='p-3 border table-cell'>{firstName || '-'}</div>
                        </div>
                    ))
                    : <div className='table-row'>
                        <div className='table-cell' />
                        <div className='table-cell text-center'>
                            <span className='text-3xl font-medium'>
                                {user ? 'No users available' : 'Please, Log In'}
                            </span>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

const UserList = (props: Props) => {
    const token = useStore($token);
    useGate(userGate, token);

    const loading = useStore(fetchUsersFx.pending);
    return (
        <div className='p-3'>
            {loading ? <Loading /> : <List />}
        </div>)
}

export default UserList;