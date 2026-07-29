import { lazy, Suspense } from 'react';

const BackgroundUniverse = lazy(() =>
  import('./VisualEcosystem').then(module => ({ default: module.BackgroundUniverse }))
);

export default function LazyBackgroundUniverse() {
  return (
    <Suspense fallback={<div className="absolute inset-0 pointer-events-none" aria-hidden="true" />}>
      <BackgroundUniverse />
    </Suspense>
  );
}
