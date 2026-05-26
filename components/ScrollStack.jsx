import { useLayoutEffect, useRef, useCallback, useState } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  showDots = false,
  onStackComplete,
  onActiveIndexChange
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);
  const activeIndexRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsCount, setCardsCount] = useState(0);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller.scrollTop,
        containerHeight: scroller.clientHeight,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    element => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  const dimensionsRef = useRef({ cardsTop: [], endTop: 0, containerHeight: 0 });

  const calculateDimensions = useCallback(() => {
    if (!cardsRef.current.length) return;
    
    const containerHeight = useWindowScroll ? window.innerHeight : scrollerRef.current.clientHeight;
    
    const scrollerInner = scrollerRef.current?.querySelector('.scroll-stack-inner');
    const endElement = scrollerInner
      ? Array.from(scrollerInner.children).find(el => el.classList.contains('scroll-stack-end'))
      : null;
      
    const endTop = endElement ? getElementOffset(endElement) : 0;
    
    const cardsTop = cardsRef.current.map(card => card ? getElementOffset(card) : 0);
    
    dimensionsRef.current = { containerHeight, endTop, cardsTop };
  }, [useWindowScroll, getElementOffset]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const scrollTop = useWindowScroll ? window.scrollY : scrollerRef.current.scrollTop;
    const { containerHeight, endTop, cardsTop } = dimensionsRef.current;
    
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    let computedActiveIndex = 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const delayPx = itemDistance || 0;
      let delayOffset = delayPx * i;
      if (i >= 2) {
        delayOffset += 1000;
      }
      
      const cardTop = cardsTop[i];
      const virtualTop = cardTop + delayOffset;

      const triggerStart = virtualTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = virtualTop - scaleEndPositionPx;
      const pinStart = virtualTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endTop - containerHeight / 2;

      if (scrollTop >= pinStart) {
        computedActiveIndex = i;
      }

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        const entryProgress = calculateProgress(
          scrollTop,
          pinStart - containerHeight,
          pinStart
        );
        if (entryProgress < 1) {
          // Use a smooth quadratic curve for a premium focus transition
          blur = Math.pow(1 - entryProgress, 2) * blurAmount;
        }
      }

      let translateY = delayOffset;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    if (computedActiveIndex !== activeIndexRef.current) {
      activeIndexRef.current = computedActiveIndex;
      setActiveIndex(computedActiveIndex);
      onActiveIndexChange?.(computedActiveIndex);
    }

    isUpdatingRef.current = false;
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    onActiveIndexChange,
    calculateProgress,
    parsePercentage
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.6,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.07,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = time => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      window.lenis = lenis;
      return lenis;
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner'),
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        gestureOrientationHandler: true,
        normalizeWheel: true,
        wheelMultiplier: 1,
        touchInertiaMultiplier: 35,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
        touchInertia: 0.6
      });

      lenis.on('scroll', handleScroll);

      const raf = time => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollerInner = scrollerRef.current?.querySelector('.scroll-stack-inner');
    const cards = scrollerInner
      ? Array.from(scrollerInner.children).filter(el => el.classList.contains('scroll-stack-card'))
      : [];

    cardsRef.current = cards;
    setCardsCount(cards.length);
    const transformsCache = lastTransformsRef.current;
    
    const delayPx = itemDistance || 0;

    cards.forEach((card, i) => {
      // Remove physical margin to prevent DOM space issues
      card.style.marginBottom = '0px';
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      card.style.webkitPerspective = '1000px';
    });

    if (scrollerInner) {
      const existingSpacer = Array.from(scrollerInner.children).find(el => el.classList.contains('scroll-delay-spacer'));
      if (existingSpacer) existingSpacer.remove();
      
      if (delayPx > 0 && cards.length > 1) {
        const spacer = document.createElement('div');
        spacer.className = 'scroll-delay-spacer';
        spacer.style.height = `${(cards.length - 1) * delayPx + 1000}px`;
        spacer.style.width = '100%';
        spacer.style.pointerEvents = 'none';
        
        const endElement = Array.from(scrollerInner.children).find(el => el.classList.contains('scroll-stack-end'));
        if (endElement && endElement.parentNode === scrollerInner) {
          scrollerInner.insertBefore(spacer, endElement);
        } else {
          scrollerInner.appendChild(spacer);
        }
      }
    }

    // Calculate dimensions AFTER the spacer is appended so endTop is correct
    calculateDimensions();
    const handleResize = () => calculateDimensions();
    window.addEventListener('resize', handleResize);

    setupLenis();

    updateCardTransforms();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms,
    calculateDimensions
  ]);
  const handleDotClick = useCallback((idx) => {
    if (!cardsRef.current[idx]) return;
    const { cardsTop, containerHeight } = dimensionsRef.current;
    const cardTop = cardsTop[idx];
    const delayPx = itemDistance || 0;
    let delayOffset = delayPx * idx;
    if (idx >= 2) {
      delayOffset += 1000;
    }
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    
    const targetScroll = cardTop + delayOffset - stackPositionPx - itemStackDistance * idx;
    
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetScroll);
    } else if (useWindowScroll) {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else if (scrollerRef.current) {
      scrollerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, [itemDistance, stackPosition, itemStackDistance, useWindowScroll, parsePercentage]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end" />
      </div>
      
      {showDots && cardsCount > 0 && (
        <div className="scroll-stack-dots">
          {Array.from({ length: cardsCount }).map((_, idx) => (
            <button
              key={idx}
              className={`scroll-stack-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to section ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScrollStack;
