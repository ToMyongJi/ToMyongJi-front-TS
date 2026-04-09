import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export type ElementSize = {
  width: number;
  height: number;
};

/**
 * Tailwind 기본 스크린(`sm` … `2xl`)과 같은 **픽셀** 기준.
 * 문서의 `40rem`(640px) 등은 루트 `font-size`(예: 62.5%)와 무관하게, 미디어 쿼리에서 흔히 쓰는 해석에 맞춘 값이다.
 * @see https://tailwindcss.com/docs/responsive-design
 */
const TAILWIND_DEFAULT_MIN_WIDTH_PX = {
  mr: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export function getTailwindMinBreakpointsPx(): {
  mr: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
} {
  return { ...TAILWIND_DEFAULT_MIN_WIDTH_PX };
}

export type TailwindMinBreakpointKey = 'none' | 'mr' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** 주어진 너비가 Tailwind `min-*` 기준으로 어느 구간인지 (mobile-first). */
export function minTailwindBreakpointForWidth(width: number): TailwindMinBreakpointKey {
  const b = getTailwindMinBreakpointsPx();
  if (width >= b['2xl']) {
    return '2xl';
  }
  if (width >= b.xl) {
    return 'xl';
  }
  if (width >= b.lg) {
    return 'lg';
  }
  if (width >= b.md) {
    return 'md';
  }
  if (width >= b.sm) {
    return 'sm';
  }
  if (width >= b.mr) {
    return 'mr';
  }
  return 'none';
}

/**
 * 요소의 실제 레이아웃 너비·높이. 사이드바로 인한 flex 폭 변화도 `ResizeObserver`로 반영된다.
 */
export function useElementSize<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  const update = useCallback((el: T) => {
    const { width, height } = el.getBoundingClientRect();
    setSize({ width, height });
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    update(el);

    const ro = new ResizeObserver(() => {
      update(el);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, [update]);

  return { ref, width: size.width, height: size.height };
}
