import React from 'react';

import Modal, { openModal } from './components/modal';
import UserList from './components/user-list';
import { useStore } from 'effector-react';
import { $user, logout } from './model/user';

function App() {
  const user = useStore($user);
  return (
    <div className="flex flex-col">
      <header className='flex justify-between items-center p-5 bg-gradient-to-tr from-blue-300 to-pink-500'>
        <span className='text-xl font-bold text-white'>
          Auth App
        </span>
        {user === null
          ? <button
            className='py-2 px-4 bg-gray-700 rounded-md transition-shadow hover:shadow-md text-lg font-medium text-white'
            onClick={() => openModal()}
          >
            Log In
          </button>
          : <button
            className='py-2 px-4 bg-gray-700 rounded-md transition-shadow hover:shadow-md text-lg font-medium text-white'
            onClick={() => logout()}
          >
            Log Out
          </button>
        }
      </header>
      <div>
        <UserList />
      </div>
      <Modal />
    </div>
  );
}

export default App;
