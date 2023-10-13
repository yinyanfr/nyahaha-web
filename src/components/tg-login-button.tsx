import { useEffect, useRef } from 'react';

/*
<script async src="https://telegram.org/js/telegram-widget.js?22" 
data-telegram-login="nyahaha_bot" data-size="large" data-auth-url="" 
data-request-access="write"></script>
*/

export default function TGLoginButton() {
  const tgLoginWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tgLoginButtonScript = document.createElement('script');
    tgLoginButtonScript.async = true;
    tgLoginButtonScript.src = 'https://telegram.org/js/telegram-widget.js?22';
    tgLoginButtonScript.setAttribute('data-telegram-login', 'nyahaha_bot');
    tgLoginButtonScript.setAttribute('data-size', 'large');
    tgLoginButtonScript.setAttribute('data-auth-url', '/user');
    tgLoginButtonScript.setAttribute('data-request-access', 'write');

    tgLoginWrapperRef?.current?.appendChild(tgLoginButtonScript);
  }, []);

  return <div ref={tgLoginWrapperRef} />;
}
