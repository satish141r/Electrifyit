import React, { useState } from 'react';
import Dashboard from './Dashboard';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className=' sm:h-screen fixed'>
      {/* Toggle Button (visible on small screens) */}
      <button
        className="p-4 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Close Menu' : 'Open Menu'}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-gray-600 h-screen fixed text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        {/* Close Button inside the Sidebar */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden mb-4"
        >
          Close
        </button>

        {/* Sidebar content here */}
        <nav>
            <a href='https://electrifyitnow.com/' className='flex justify-center mb-5'>
                <img src='https://img1.wsimg.com/isteam/ip/a679304e-b611-430c-a79d-4977df260aa3/PRIMARY.png/:/rs=w:76,h:99,cg:true,m/cr=w:76,h:99/qt=q:95' height={50} width={50}/>
            </a>
          <a href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Dashboard</a>
          <a href="login" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">About</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Services</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Contact</a>
        </nav>
      </div>
      <div>
        {/* <Dashboard/> */}
      </div>
    </div>
  );
};

export default Sidebar;
