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

    setFlyItem({
      startX: sourceRect.left + sourceRect.width / 2,
      startY: sourceRect.top + sourceRect.height / 2,
      endX: cartRect.left + cartRect.width / 2,
      endY: cartRect.top + cartRect.height / 2,
      image: imageUrl,
      isMobile,
    });

    // Duración más larga en móvil para que se aprecie el arco
    const duration = isMobile ? 900 : 650;

    setTimeout(() => {
      setFlyItem(null);
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 500);
    }, duration);
  }, []);

  return (
    <FlyToCartContext.Provider
      value={{
        flyToCart,
        flyItem,
        cartBounce,
        cartIconRef,
        cartBottomRef,
      }}
    >
      {children}
      {flyItem && <FlyingItem item={flyItem} />}
    </FlyToCartContext.Provider>
  );
}

function FlyingItem({ item }) {
  const { startX, startY, endX, endY, isMobile } = item;

  // Calculamos el punto de control del arco de Bezier
  // En móvil: el producto sube hacia arriba primero y luego baja al carrito (abajo)
  // En desktop: curva lateral elegante
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  // Control point: en móvil desviamos hacia arriba y al centro de la pantalla
  // En desktop: desviamos lateralmente
  const cpX = isMobile
    ? window.innerWidth / 2                        // centro horizontal de pantalla
    : midX + (endX > startX ? -120 : 120);        // desktop: curva lateral
  const cpY = isMobile
    ? Math.min(startY, endY) - window.innerHeight * 0.35  // sube bastante en móvil
    : midY - 180;                                          // desktop: sube moderado

  // Generamos los keyframes interpolando la curva de Bézier cuadrática
  // P(t) = (1-t)²·P0 + 2(1-t)t·P1 + t²·P2
  const steps = 20;
  const keyframes = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const inv = 1 - t;
    const x = inv * inv * startX + 2 * inv * t * cpX + t * t * endX;
    const y = inv * inv * startY + 2 * inv * t * cpY + t * t * endY;

    // Escala: empieza en 1, crece un poco en el arco, termina en 0.08
    const scale = i === steps
      ? 0.08
      : 1 + Math.sin(t * Math.PI) * (isMobile ? 0.25 : 0.15);

    // Rotación: gira suavemente durante el vuelo
    const rotate = t * (isMobile ? 280 : 180);

    // Opacidad: fade out al final
    const opacity = t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1;

    return `${Math.round(t * 100)}% {
      transform: translate(${x}px, ${y}px) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(1)}deg);
      opacity: ${opacity.toFixed(2)};
    }`;
  }).join("\n");

  const duration = isMobile ? 900 : 650;
  const easing = isMobile
    ? "cubic-bezier(0.2, 0.8, 0.4, 1)"
    : "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  const animName = `flyToCart_${Date.now()}`;

  return (
    <>
      <style>{`
        @keyframes ${animName} {
          ${keyframes}
        }

        @keyframes trailFade {
          0% { opacity: 0.35; transform: translate(${startX}px, ${startY}px) scale(0.9); }
          100% { opacity: 0; transform: translate(${cpX}px, ${cpY}px) scale(0.3); }
        }

        @keyframes ripple {
          0%   { transform: translate(${endX}px, ${endY}px) scale(0); opacity: 0.6; }
          100% { transform: translate(${endX}px, ${endY}px) scale(3); opacity: 0; }
        }

        .fly-item-main {
          position: fixed;
          top: -40px;
          left: -40px;
          width: 80px;
          height: 80px;
          border-radius: 10px;
          object-fit: cover;
          pointer-events: none;
          z-index: 9999;
          animation: ${animName} ${duration}ms ${easing} forwards;
          box-shadow: 0 8px 28px rgba(0,0,0,0.25);
          will-change: transform, opacity;
        }

        .fly-item-trail {
          position: fixed;
          top: -24px;
          left: -24px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          background: rgba(0,0,0,0.08);
          animation: trailFade ${duration * 0.5}ms ease-out forwards;
          will-change: transform, opacity;
        }

        .fly-item-ripple {
          position: fixed;
          top: -20px;
          left: -20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.3);
          pointer-events: none;
          z-index: 9997;
          animation: ripple 0.45s ease-out ${duration - 100}ms forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
      `}</style>

      {/* Estela detrás del producto */}
      <div className="fly-item-trail" />

      {/* Imagen principal volando */}
      <img className="fly-item-main" src={item.image} alt="" />

      {/* Ripple al llegar al carrito */}
      <div className="fly-item-ripple" />
    </>
  );
}

export const useFlyToCart = () => useContext(FlyToCartContext);