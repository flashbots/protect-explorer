'use client'

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import AddressChecker from './components/AddressChecker/AddressChecker';
import Table from './components/Table/Table';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navbar />
      <Hero />
      <AddressChecker />
      <Table />
    </main>
  );
}
