'use client'

import Hero from './components/Hero/Hero';
import Table from './components/Table/Table';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <Table />
    </main>
  );
}
