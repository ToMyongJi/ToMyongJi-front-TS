import queryClient from '@libs/query-client';
import { router } from '@routes/routers';
import { useModalStore } from '@store/modal-store';
import { QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

// framer-motion을 물고 있어 정적 import 시 초기 번들에 남는다.
// 모달은 사용자 액션 후에만 뜨므로 열림 상태로 게이팅해 그 시점에 로드한다.
const RootModal = lazy(() => import('@components/modal/root-modal'));

function App() {
  const isModalOpen = useModalStore((state) => state.type !== null && state.props !== null);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {isModalOpen && (
        <Suspense fallback={null}>
          <RootModal />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}

export default App;
