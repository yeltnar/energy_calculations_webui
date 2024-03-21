"use client"

import { Suspense, lazy } from 'react';
import Loading from './Loading.js';

const Data = lazy(() => import('./Data.js'));

export default function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
          <Data/>
        </Suspense>
    </>
  );
}
