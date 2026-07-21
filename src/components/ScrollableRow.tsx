'use client';

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import styles from './ScrollableRow.module.scss';

export default function ScrollableRow({
  children,
  ariaLabel,
}: {
  children: ReactNode;
  ariaLabel: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ width: 100, left: 0 });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    function update() {
      if (!el) {
        return;
      }
      const { scrollWidth, clientWidth, scrollLeft } = el;
      if (scrollWidth <= clientWidth) {
        setThumb({ width: 100, left: 0 });
        return;
      }
      const width = (clientWidth / scrollWidth) * 100;
      const maxScroll = scrollWidth - clientWidth;
      const left = maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - width) : 0;
      setThumb({ width, left });
    }

    update();
    el.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  function scrollToClientX(clientX: number) {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) {
      return;
    }
    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollLeft = Math.max(0, Math.min(maxScroll, ratio * el.scrollWidth - el.clientWidth / 2));
  }

  function handleTrackPointerDown(event: PointerEvent<HTMLDivElement>) {
    scrollToClientX(event.clientX);

    function handleMove(moveEvent: globalThis.PointerEvent) {
      scrollToClientX(moveEvent.clientX);
    }

    function handleUp() {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    }

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  }

  return (
    <div>
      <div
        ref={scrollRef}
        className={styles.scroll}
        tabIndex={0}
        role="region"
        aria-label={ariaLabel}
      >
        {children}
      </div>
      <div
        ref={trackRef}
        className={styles.track}
        aria-hidden="true"
        onPointerDown={handleTrackPointerDown}
      >
        <div
          className={styles.thumb}
          style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }}
        />
      </div>
    </div>
  );
}
