import { useEffect, useRef } from 'react';

export default function FacebookFollowCard() {
  const ref = useRef(null);

  useEffect(() => {
    let active = true;

    const parseWidget = () => {
      if (active && window.FB?.XFBML && ref.current) {
        window.FB.XFBML.parse(ref.current);
      }
    };

    // The SDK in index.html may finish loading before React mounts.
    if (window.FB?.XFBML) {
      parseWidget();
    } else {
      const script = document.getElementById('facebook-jssdk');
      if (script) {
        script.addEventListener('load', parseWidget, { once: true });
      }
      // Also retry when the SDK's async initialization callback runs.
      const previousInit = window.fbAsyncInit;
      window.fbAsyncInit = function () {
        if (typeof previousInit === 'function') previousInit();
        parseWidget();
      };
    }

    return () => {
      active = false;
    };
  }, []);

  return (
    <div ref={ref} className="fb-widget-wrapper">
      <div
        className="fb-page"
        data-href="https://www.facebook.com/azmeyra"
        data-tabs=""
        data-width="340"
        data-height="130"
        data-small-header="true"
        data-adapt-container-width="true"
        data-hide-cover="true"
        data-show-facepile="false"
      >
        <blockquote cite="https://www.facebook.com/azmeyra" className="fb-xfbml-parse-ignore">
          <a href="https://www.facebook.com/azmeyra">Azmeyra</a>
        </blockquote>
      </div>
    </div>
  );
}
