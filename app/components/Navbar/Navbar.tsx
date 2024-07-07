import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-spurple text-white w-full flex justify-between items-center py-4 px-4 sm:px-32 lg:px-80 border-b border-durple">
      <div className="flex items-center">
        <img src="/explorer/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
        <span className="font-bold hidden md:block">Protect Explorer</span>
      </div>
      <Link href="https://protect.flashbots.net" passHref>
        <button className="bg-white text-spurple px-4 py-2 rounded-md">Get Protected</button>
      </Link>
    </nav>
  );
};

export default Navbar;