import { useEffect, useRef } from 'react';

export default function FacebookFollowCard() {
  const ref = useRef(null);

  useEffect(() => {
    let active = true;
    const parseWidget = () => {
      if (active && window.FB && window.FB.XFBML && ref.current) {
        window.FB.XFBML.parse(ref.current);
      }
    };

    const existingScript = document.getElementById('facebook-jssdk');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.addEventListener('load', parseWidget, { once: true });
      document.body.appendChild(script);
    } else if (window.FB && window.FB.XFBML) {
      parseWidget();
    } else {
      existingScript.addEventListener('load', parseWidget, { once: true });
    }

    return () => {
      active = false;
      existingScript?.removeEventListener('load', parseWidget);
    };
  }, []);

  return (
    <div ref={ref} className="fb-widget-wrapper">
      <div className="fb-widget-card">
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
    </div>
  );
}
