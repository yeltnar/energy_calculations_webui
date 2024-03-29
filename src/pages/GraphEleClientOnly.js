"use client"

import { Suspense, lazy } from 'react';
import Loading from '../app/Loading.js';
import getData from '@/getData';

const GraphEle = lazy(async() => {
    await getData();
    const to_return = import('./GraphEle.js');
    return to_return;
  });
  
  export default function App() {
    return (
      <>
        <Suspense fallback={<Loading />}>
            <GraphEle/>
          </Suspense>
      </>
    );
  }