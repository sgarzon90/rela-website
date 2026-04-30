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
  const [flyItem, setFlyItem] = useState(null); // { x, y, image }
  const [cartBounce, setCartBounce] = useState(false);
  const cartIconRef = useRef(null); // ref al ícono del carrito en el navbar

  const flyToCart = useCallback((sourceRect, imageUrl) => {
    if (!cartIconRef.current) return;

    const cartRect = cartIconRef.current.getBoundingClientRect();

    setFlyItem({
      startX: sourceRect.left + sourceRect.width / 2,
      startY: sourceRect.top + sourceRect.height / 2,
      endX: cartRect.left + cartRect.width / 2,
      endY: cartRect.top + cartRect.height / 2,
      image: imageUrl,
    });

    // Al terminar la animación (600ms), hacer bounce en el carrito
    setTimeout(() => {
      setFlyItem(null);
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 400);
    }, 650);
  }, []);

  return (
    <FlyToCartContext.Provider
      value={{ flyToCart, flyItem, cartBounce, cartIconRef }}
    >
      {children}
      {/* Elemento volador */}
      {flyItem && <FlyingItem item={flyItem} />}
    </FlyToCartContext.Provider>
  );
}

function FlyingItem({ item }) {
  return (
    <>
      <style>{`
        @keyframes flyToCart {
          0% {
            transform: translate(${item.startX}px, ${item.startY}px) scale(1);
            opacity: 1;
          }
          60% {
            opacity: 1;
          }
          100% {
            transform: translate(${item.endX}px, ${item.endY}px) scale(0.1);
            opacity: 0;
          }
        }
        .fly-item {
          position: fixed;
          top: -40px;
          left: -40px;
          width: 80px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
          pointer-events: none;
          z-index: 9999;
          animation: flyToCart 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
      `}</style>
      <img className="fly-item" src={item.image} alt="" />
    </>
  );
}

export const useFlyToCart = () => useContext(FlyToCartContext);
