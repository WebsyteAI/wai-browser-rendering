// src/components/AdSense.tsx
import { jsx } from 'hono/jsx';

export function AdSense() {
  return (
    <div class="w-full max-w-2xl mx-auto mt-8">
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1735153339641617"
        crossOrigin="anonymous"
      ></script>
      <ins
        class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-1735153339641617"
        data-ad-slot="9836590439"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script dangerouslySetInnerHTML={{
        __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
      }}></script>
    </div>
  );
}