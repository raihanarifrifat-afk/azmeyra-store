import { useEffect } from 'react';

export default function FacebookFollowCard() {
  useEffect(() => {
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    } else if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);

  return (
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
  );
}
