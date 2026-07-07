import { useEffect, useRef } from "react";

interface AdSenseAdProps {
  slot: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

export default function AdSenseAd({ slot, style }: AdSenseAdProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // Only request an ad if this slot hasn't been filled yet — pushing again for an
      // already-processed <ins> throws "All 'ins' elements ... already have ads in them"
      if (adRef.current && !adRef.current.getAttribute('data-adsbygoogle-status')) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block", ...style }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-4285007880246877"}
      data-ad-slot={slot}
      data-ad-format="auto"
    />
  );
}