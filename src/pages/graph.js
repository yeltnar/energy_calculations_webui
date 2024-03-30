"use client"

import dynamic from 'next/dynamic';
import "./graph.css"

const ComponentC = dynamic(() => import('./GraphEleClientOnly.js'), { ssr: false })

export default function App() {
  return (
    <ComponentC />
  );
}
