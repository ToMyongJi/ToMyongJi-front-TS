import bang from '@assets/icons/bang.svg';
import Button from '@components/common/button';
import { useEffect } from 'react';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';

// 같은 세션에서 자동 새로고침이 반복되지 않도록 마지막 시각을 남긴다.
const RELOAD_AT_KEY = 'route-error:reloaded-at';
const RELOAD_COOLDOWN = 10_000;

// 라우트 기반 코드 스플리팅 이후 생긴 실패 유형이다.
// 배포로 청크 해시가 바뀌면 오래 열어둔 탭이 사라진 청크를 요청해 이 에러가 난다.
const isChunkLoadError = (error: unknown) => {
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  return /dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(
    message,
  );
};

const getMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  return String(error);
};

const RouteError = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const isChunkError = isChunkLoadError(error);
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  useEffect(() => {
    if (!isChunkError) return;

    // 새 배포로 청크가 교체된 경우라면 새로고침 한 번으로 복구된다.
    // 다만 청크를 정말로 받지 못하는 상황에서는 새로고침이 무한 반복되므로,
    // 직전 자동 새로고침 이후 쿨다운 안에 또 났다면 복구 불가로 보고 안내 화면을 그대로 둔다.
    const lastReloadedAt = Number(sessionStorage.getItem(RELOAD_AT_KEY) ?? 0);
    if (Date.now() - lastReloadedAt < RELOAD_COOLDOWN) return;

    sessionStorage.setItem(RELOAD_AT_KEY, String(Date.now()));
    window.location.reload();
  }, [isChunkError]);

  const { title, description } = isChunkError
    ? {
        title: '새 버전이 배포되었어요',
        description: '페이지를 새로고침하면 이어서 이용할 수 있어요.',
      }
    : isNotFound
      ? {
          title: '페이지를 찾을 수 없어요',
          description: '주소가 바뀌었거나 삭제된 페이지일 수 있어요.',
        }
      : {
          title: '문제가 발생했어요',
          description: '잠시 후 다시 시도해 주세요. 계속 발생하면 새로고침해 주세요.',
        };

  return (
    <div className="h-full w-full flex-col-center items-center justify-center px-[1.5rem]">
      <div className="flex w-full max-w-[42rem] flex-col-center gap-[3rem]">
        <img src={bang} alt="bang" className="h-[6.6rem] w-[6.6rem]" />
        <div className="flex flex-col-center gap-[1rem]">
          <p className="W_Title text-center text-black">{title}</p>
          <p className="W_B17 text-center text-gray-80">{description}</p>
        </div>
        {import.meta.env.DEV && (
          <p className="W_M15 w-full break-all rounded-[1rem] bg-gray-10 px-[1.6rem] py-[1.2rem] text-gray-80">
            {getMessage(error)}
          </p>
        )}
        <div className="flex w-full gap-[1rem]">
          {!isNotFound && (
            <Button variant="primary" onClick={() => window.location.reload()} className="w-full">
              새로고침
            </Button>
          )}
          <Button
            variant={isNotFound ? 'primary' : 'gray_outline'}
            onClick={() => navigate('/', { replace: true })}
            className="w-full"
          >
            홈으로
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RouteError;
