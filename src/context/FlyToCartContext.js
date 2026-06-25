"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";

const FlyToCartContext = createContext({});

export function FlyToCartProvider({ children }) {
  const [flyItem, setFlyItem] = useState(null);
  const [cartBounce, setCartBounce] = useState(false);

  const cartIconRef = useRef(null);   // carrito desktop (navbar)
  const cartBottomRef = useRef(null); // carrito móvil (bottom bar)

  const flyToCart = useCallback((sourceRect, imageUrl) => {
    const isMobile = window.innerWidth < 768;
    const targetRef = isMobile ? cartBottomRef : cartIconRef;
    if (!targetRef.current) return;

    const cartRect = targetRef.current.getBoundingClientRect();
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    let startX = sourceRect.left + sourceRect.width / 2;
    let startY = sourceRect.top + sourceRect.height / 2;

    // En móvil, el botón sticky y el carrito están casi en la misma posición
    // (ambos en la parte inferior de la pantalla). Lanzamos desde el centro
    // visual de la pantalla para que la animación sea visible.
    if (isMobile && Math.abs(startY - endY) < 200) {
      startX = window.innerWidth * 0.5;
      startY = window.innerHeight * 0.38;
    }

    setFlyItem({ startX, startY, endX, endY, image: imageUrl, isMobile });

    const duration = isMobile ? 800 : 580;
    setTimeout(() => {
      setFlyItem(null);
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 600);
    }, duration);
  }, []);

  return (
    <FlyToCartContext.Provider
      value={{ flyToCart, flyItem, cartBounce, cartIconRef, cartBottomRef }}
    >
      {children}
      {flyItem && <FlyingItem item={flyItem} />}
    </FlyToCartContext.Provider>
  );
}

function bezier(t, p0, p1, p2) {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
}

function FlyingItem({ item }) {
  const { startX, startY, endX, endY, isMobile, image } = item;

  // Punto de control: siempre sube hacia arriba y ligeramente hacia el destino
  const cpX = startX + (endX - startX) * 0.35;
  const cpY = Math.min(startY, endY) - (isMobile ? window.innerHeight * 0.38 : 220);

  const steps = 28;
  const keyframes = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const x = bezier(t, startX, cpX, endX);
    const y = bezier(t, startY, cpY, endY);

    // Escala: crece un poco en el arco, se reduce al llegar
    const scale = t === 1 ? 0 : 1 + Math.sin(t * Math.PI) * 0.18 - t * 0.15;
    // Rotación suave
    const rotate = t * (isMobile ? 260 : 160);
    // Fade out al final del recorrido
    const opacity = t > 0.72 ? Math.max(0, 1 - (t - 0.72) / 0.28) : 1;

    return `${Math.round(t * 100)}% {
      transform: translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(1)}deg);
      opacity: ${opacity.toFixed(2)};
    }`;
  }).join("\n");

  const duration = isMobile ? 800 : 580;
  const easing = "cubic-bezier(0.22, 0.61, 0.36, 1)";
  const animName = `fly_${Date.now()}`;

  return (
    <>
      <style>{`
        @keyframes ${animName} { ${keyframes} }

        @keyframes ${animName}_trail {
          0%   { opacity: 0.3; transform: translate(${startX.toFixed(0)}px, ${startY.toFixed(0)}px) scale(0.85); }
          60%  { opacity: 0.15; }
          100% { opacity: 0; transform: translate(${cpX.toFixed(0)}px, ${cpY.toFixed(0)}px) scale(0.25); }
        }

        @keyframes ${animName}_ripple {
          0%   { transform: translate(${endX.toFixed(0)}px, ${endY.toFixed(0)}px) scale(0); opacity: 0.7; }
          100% { transform: translate(${endX.toFixed(0)}px, ${endY.toFixed(0)}px) scale(3.5); opacity: 0; }
        }

        .fly-main-${animName} {
          position: fixed;
          top: -36px; left: -36px;
          width: 72px; height: 72px;
          border-radius: 10px;
          object-fit: cover;
          pointer-events: none;
          z-index: 9999;
          animation: ${animName} ${duration}ms ${easing} forwards;
          box-shadow: 0 6px 24px rgba(0,0,0,0.22);
          will-change: transform, opacity;
          overflow: hidden;
        }

        .fly-trail-${animName} {
          position: fixed;
          top: -20px; left: -20px;
          width: 40px; height: 40px;
          border-radius: 50%;
          background: rgba(0,0,0,0.07);
          pointer-events: none;
          z-index: 9998;
          animation: ${animName}_trail ${duration * 0.55}ms ease-out forwards;
          will-change: transform, opacity;
        }

        .fly-ripple-${animName} {
          position: fixed;
          top: -18px; left: -18px;
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.25);
          pointer-events: none;
          z-index: 9997;
          animation: ${animName}_ripple 420ms ease-out ${duration - 80}ms forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
      `}</style>

      <div className={`fly-trail-${animName}`} />

      {image ? (
        <img className={`fly-main-${animName}`} src={image} alt="" />
      ) : (
        <div
          className={`fly-main-${animName}`}
          style={{ background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
        </div>
      )}

      <div className={`fly-ripple-${animName}`} />
    </>
  );
}

export const useFlyToCart = () => useContext(FlyToCartContext);
