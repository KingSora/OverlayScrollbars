'use client';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export interface GoogleAdProps {
  /** The id of the ad slot. */
  adSlotId: string;
  /** The className. */
  className?: string;
  /** The className of the ad slot element. */
  slotClassName?: string;
  /** The style. */
  style?: ComponentPropsWithoutRef<'ins'>['style'];
  /** The format of the ad. */
  format?: GoogleAdFormat;
}

export interface GoogleAdChildrenProps {
  filled: boolean;
}

export type GoogleAdFormat =
  | 'vertical'
  | 'horizontal'
  | 'rectangle'
  | 'auto'
  | {
      width?: number;
      height?: number;
    };

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const getAdsByGoogleArr = () => (window.adsbygoogle = window.adsbygoogle || []);

export const GoogleAd = ({
  adSlotId,
  className,
  slotClassName,
  style,
  format = 'auto',
}: GoogleAdProps) => {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLModElement>(null);
  const formatIsFixed = typeof format === 'object';

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const obj = {};
    try {
      getAdsByGoogleArr().push(obj);
      // eslint-disable-next-line no-empty
    } catch {}

    return () => {
      try {
        const arr = getAdsByGoogleArr();
        const idx = arr.indexOf(obj);
        if (idx > -1) {
          arr.splice(idx, 1);
        }
        // eslint-disable-next-line no-empty
      } catch {}
    };
  }, [mounted]);

  return (
    <div className={className} style={style}>
      <ins
        ref={ref}
        className={cn(
          'adsbygoogle default:block default:data-[ad-status]:flex default:w-full default:h-full justify-center items-center mx-auto',
          slotClassName
        )}
        style={{
          ...(formatIsFixed ? { width: `${format.width}px`, height: `${format.height}px` } : {}),
        }}
        data-ad-slot={mounted ? adSlotId : undefined}
        data-ad-client={mounted ? `ca-pub-3339885551695153` : undefined}
        {...(formatIsFixed
          ? {}
          : {
              'data-ad-format': format,
              'data-full-width-responsive': 'true',
            })}
      />
    </div>
  );
};
