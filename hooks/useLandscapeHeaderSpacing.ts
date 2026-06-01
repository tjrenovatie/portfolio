"use client";

import { useLayoutEffect, useState, type CSSProperties } from "react";

const BASE_MOBILE_EDGE_OFFSET = "0rem";
const LANDSCAPE_EXTRA_EDGE_OFFSET = "0rem";
const MENU_BUTTON_EDGE_OFFSET = "0.5rem";
const MAX_LANDSCAPE_WIDTH = 1366;

export function useLandscapeHeaderSpacing() {
  const [isLandscapeHeader, setIsLandscapeHeader] = useState(false);

  useLayoutEffect(() => {
    const update = () => {
      const viewport = window.visualViewport;
      const width = viewport?.width ?? window.innerWidth;
      const height = viewport?.height ?? window.innerHeight;

      setIsLandscapeHeader(width > height && width <= MAX_LANDSCAPE_WIDTH);
    };

    update();

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    window.visualViewport?.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  const edgeOffset = `calc(${BASE_MOBILE_EDGE_OFFSET} + ${LANDSCAPE_EXTRA_EDGE_OFFSET})`;

  const navStyle: CSSProperties | undefined = isLandscapeHeader
    ? {
        paddingLeft: `calc(env(safe-area-inset-left, 0px) + ${edgeOffset})`,
        paddingRight: `calc(env(safe-area-inset-right, 0px) + ${edgeOffset})`,
      }
    : undefined;

  const menuButtonStyle: CSSProperties | undefined = isLandscapeHeader
    ? {
        right: MENU_BUTTON_EDGE_OFFSET,
      }
    : undefined;

  return {
    isLandscapeHeader,
    menuButtonStyle,
    navStyle,
  };
}
