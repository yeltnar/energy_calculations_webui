"use client"

import dynamic from 'next/dynamic';

const ComponentC = dynamic(() => import('./GraphEleClientOnly.js'), { ssr: false })

export default function App() {
  return (
    <ComponentC />
  );
}
