import { adminMutations } from '@apis/admin/admin-mutations';
import useMaintenanceStore from '@store/maintenance-store';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

/**
 * 점검 종료 시각(expectedEndTime)이 지나면 자동으로 status를 'normal'로 변경하는 훅.
 * - 관리자(isAdmin)만 API를 호출할 수 있으므로 isAdmin이 true일 때만 동작.
 * - 두 가지 경우를 처리:
 *   1. 관리자가 점검 중 탭을 열고 있을 때 → setTimeout으로 종료 시각에 맞춰 자동 호출
 *   2. 관리자가 종료 시각 이후에 접속했을 때 → 즉시 자동 호출
 */
const useMaintenanceAutoReset = (isAdmin: boolean) => {
  const { isMaintenance, info } = useMaintenanceStore();
  const { mutate: setStatus } = useMutation(adminMutations.setStatus());
  // 중복 호출 방지 플래그 (점검 설정이 바뀔 때마다 초기화)
  const resetSentRef = useRef(false);

  // isMaintenance가 false로 바뀌면 플래그 초기화 (다음 점검을 위해)
  useEffect(() => {
    if (!isMaintenance) {
      resetSentRef.current = false;
    }
  }, [isMaintenance]);

  useEffect(() => {
    if (!isAdmin || !isMaintenance || !info) return;

    const autoReset = () => {
      if (resetSentRef.current) return;
      resetSentRef.current = true;
      setStatus({
        status: 'normal',
        message: info.message,
        startTime: info.startTime,
        expectedEndTime: info.expectedEndTime,
      });
    };

    const delay = new Date(info.expectedEndTime).getTime() - Date.now();

    if (delay <= 0) {
      // 이미 종료 시각이 지났으면 즉시 리셋
      autoReset();
      return;
    }

    // 종료 시각까지 타이머 설정
    const timer = setTimeout(autoReset, delay);
    return () => clearTimeout(timer);
  }, [isAdmin, isMaintenance, info?.expectedEndTime]);
};

export default useMaintenanceAutoReset;