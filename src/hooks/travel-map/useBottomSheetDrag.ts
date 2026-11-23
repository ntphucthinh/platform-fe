import { useEffect, useRef, useCallback } from "react";

export interface UseBottomSheetDragOptions {
  effectiveIsMobile: boolean;
  prefersReducedMotion: boolean;
  open: boolean;
  onClose: () => void;
}

export interface UseBottomSheetDragReturn {
  mobileSheetRef: React.RefObject<HTMLDivElement | null>;
  backdropRef: React.RefObject<HTMLDivElement | null>;
  handleDragStart: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleDragMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleDragEnd: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export function useBottomSheetDrag({
  effectiveIsMobile,
  prefersReducedMotion,
  open,
  onClose,
}: UseBottomSheetDragOptions): UseBottomSheetDragReturn {
  // Mobile Bottom Sheet DOM refs for direct transform updates (avoids re-rendering during drag)
  const mobileSheetRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const isDismissingViaDragRef = useRef(false);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafDragRef = useRef<number | null>(null);

  // Drag state tracking ref
  const dragStateRef = useRef<{
    isDragging: boolean;
    startY: number;
    currentY: number;
    lastY: number;
    lastTime: number;
    velocity: number;
    pointerId: number | null;
  }>({
    isDragging: false,
    startY: 0,
    currentY: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    pointerId: null,
  });

  // Drag Gesture Handlers for Mobile Grab Handle
  const handleDragStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!effectiveIsMobile || e.button !== 0) return;
      // Prevent a second touch from hijacking or corrupting an active drag
      if (dragStateRef.current.isDragging) return;

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Fallback for browsers with restricted pointer capture
      }

      if (snapTimerRef.current) {
        clearTimeout(snapTimerRef.current);
        snapTimerRef.current = null;
      }

      const now = performance.now();
      dragStateRef.current = {
        isDragging: true,
        startY: e.clientY,
        currentY: e.clientY,
        lastY: e.clientY,
        lastTime: now,
        velocity: 0,
        pointerId: e.pointerId,
      };

      // Disable transition during direct finger drag
      if (mobileSheetRef.current) {
        mobileSheetRef.current.style.transition = "none";
      }
      if (backdropRef.current) {
        backdropRef.current.style.transition = "none";
      }
    },
    [effectiveIsMobile],
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const state = dragStateRef.current;
      if (!state.isDragging) return;

      state.currentY = e.clientY;
      const now = performance.now();
      const dt = now - state.lastTime;
      if (dt > 10) {
        state.velocity = (e.clientY - state.lastY) / dt;
        state.lastY = e.clientY;
        state.lastTime = now;
      }

      const rawDeltaY = e.clientY - state.startY;
      // Clamping upward movement at 0 per requirement: "Kéo lên: không đóng popup; giữ sheet tại vị trí mở ban đầu"
      const deltaY = Math.max(0, rawDeltaY);

      if (rafDragRef.current) {
        cancelAnimationFrame(rafDragRef.current);
      }

      rafDragRef.current = requestAnimationFrame(() => {
        if (!mobileSheetRef.current) return;
        mobileSheetRef.current.style.transform = `translateY(${deltaY}px)`;

        if (backdropRef.current) {
          const sheetHeight =
            mobileSheetRef.current.offsetHeight || window.innerHeight;
          const progress = Math.min(1, deltaY / (sheetHeight * 0.6));
          backdropRef.current.style.opacity = String(
            Math.max(0, 1 - progress * 0.75),
          );
        }
      });
    },
    [],
  );

  const handleDragEnd = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const state = dragStateRef.current;
      if (!state.isDragging) return;

      state.isDragging = false;
      if (state.pointerId !== null) {
        try {
          e.currentTarget.releasePointerCapture(state.pointerId);
        } catch {
          // ignore
        }
        state.pointerId = null;
      }

      if (rafDragRef.current) {
        cancelAnimationFrame(rafDragRef.current);
        rafDragRef.current = null;
      }

      const totalDeltaY = Math.max(0, e.clientY - state.startY);
      const sheetHeight =
        mobileSheetRef.current?.offsetHeight || window.innerHeight * 0.92;

      // Threshold: 110px or 20% of sheet height
      const distanceThreshold = Math.min(130, sheetHeight * 0.2);
      // Fast swipe threshold: velocity > 0.45 px/ms and pulled down > 25px
      const isFastSwipe = state.velocity > 0.45 && totalDeltaY > 25;
      const shouldDismiss = totalDeltaY >= distanceThreshold || isFastSwipe;

      if (shouldDismiss) {
        isDismissingViaDragRef.current = true;
        // Animate smooth slide down to exit
        if (mobileSheetRef.current) {
          mobileSheetRef.current.style.transition = prefersReducedMotion
            ? "none"
            : "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms cubic-bezier(0.22, 1, 0.36, 1)";
          mobileSheetRef.current.style.transform = "translateY(100%)";
          mobileSheetRef.current.style.opacity = "0";
        }
        if (backdropRef.current) {
          backdropRef.current.style.transition = prefersReducedMotion
            ? "none"
            : "opacity 260ms ease";
          backdropRef.current.style.opacity = "0";
        }

        onClose();
      } else {
        // Revert smoothly back to open position
        if (mobileSheetRef.current) {
          mobileSheetRef.current.style.transition = prefersReducedMotion
            ? "none"
            : "transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)";
          mobileSheetRef.current.style.transform = "translateY(0)";
          mobileSheetRef.current.style.opacity = "1";
        }
        if (backdropRef.current) {
          backdropRef.current.style.transition = prefersReducedMotion
            ? "none"
            : "opacity 280ms ease";
          backdropRef.current.style.opacity = "1";
        }

        // Clean up inline styles once snapback transition finishes
        snapTimerRef.current = setTimeout(() => {
          if (mobileSheetRef.current && !dragStateRef.current.isDragging) {
            mobileSheetRef.current.style.transform = "";
            mobileSheetRef.current.style.transition = "";
            mobileSheetRef.current.style.opacity = "";
          }
          if (backdropRef.current && !dragStateRef.current.isDragging) {
            backdropRef.current.style.opacity = "";
            backdropRef.current.style.transition = "";
          }
        }, 280);
      }
    },
    [onClose, prefersReducedMotion],
  );

  // Clear drag inline styles when closed via external actions (X button, backdrop click, Escape key)
  useEffect(() => {
    if (!open) {
      if (snapTimerRef.current) {
        clearTimeout(snapTimerRef.current);
        snapTimerRef.current = null;
      }
      if (!isDismissingViaDragRef.current) {
        if (mobileSheetRef.current) {
          mobileSheetRef.current.style.transform = "";
          mobileSheetRef.current.style.transition = "";
          mobileSheetRef.current.style.opacity = "";
        }
        if (backdropRef.current) {
          backdropRef.current.style.opacity = "";
          backdropRef.current.style.transition = "";
        }
      }
    } else {
      isDismissingViaDragRef.current = false;
    }
  }, [open]);

  // Clean up timers on unmount and handle window blur during gestures
  useEffect(() => {
    const handleWindowBlur = () => {
      if (dragStateRef.current.isDragging) {
        dragStateRef.current.isDragging = false;
        dragStateRef.current.pointerId = null;
        if (rafDragRef.current) {
          cancelAnimationFrame(rafDragRef.current);
          rafDragRef.current = null;
        }
        if (mobileSheetRef.current) {
          mobileSheetRef.current.style.transform = "";
          mobileSheetRef.current.style.transition = "";
          mobileSheetRef.current.style.opacity = "";
        }
        if (backdropRef.current) {
          backdropRef.current.style.opacity = "";
          backdropRef.current.style.transition = "";
        }
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      if (rafDragRef.current) {
        cancelAnimationFrame(rafDragRef.current);
      }
      if (snapTimerRef.current) {
        clearTimeout(snapTimerRef.current);
      }
    };
  }, []);

  return {
    mobileSheetRef,
    backdropRef,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
}
