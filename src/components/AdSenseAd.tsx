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
      // already-processed <ins> throws "All 'ins' elements ... already have ads in them".
      // Skip zero-width slots (inside display:none containers) — they throw
      // "No slot size for availableWidth=0" and would never render anyway.
      if (
        adRef.current &&
        !adRef.current.getAttribute('data-adsbygoogle-status') &&
        adRef.current.offsetWidth > 0
      ) {
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