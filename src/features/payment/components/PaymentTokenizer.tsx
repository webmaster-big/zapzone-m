import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import type { AuthorizeNetPublicKey, CardInput, PaymentOpaqueData } from '@/types/payment';

/**
 * Authorize.Net Accept.js bridge.
 *
 * React Native has no DOM, so card tokenization runs inside a hidden WebView
 * that loads Accept.js and calls `Accept.dispatchData`. The raw PAN/CVV are
 * handed directly to Authorize.Net's script and never reach the ZapZone backend
 * (only the resulting opaque token is), preserving the same PCI posture as web.
 */
export interface PaymentTokenizerHandle {
  tokenize: (publicKey: AuthorizeNetPublicKey, card: CardInput) => Promise<PaymentOpaqueData>;
}

interface PendingState {
  html: string;
}

type Resolver = {
  resolve: (data: PaymentOpaqueData) => void;
  reject: (error: Error) => void;
};

const TIMEOUT_MS = 30000;

function buildHtml(publicKey: AuthorizeNetPublicKey, card: CardInput): string {
  const acceptUrl =
    publicKey.environment === 'production'
      ? 'https://js.authorize.net/v1/Accept.js'
      : 'https://jstest.authorize.net/v1/Accept.js';

  const authData = JSON.stringify({
    clientKey: publicKey.client_key,
    apiLoginID: publicKey.api_login_id,
  });
  const cardData = JSON.stringify({
    cardNumber: card.cardNumber.replace(/\s+/g, ''),
    month: card.month,
    year: card.year,
    cardCode: card.cardCode,
  });

  return `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body>
<script src="${acceptUrl}"></script>
<script>
  function send(payload){ window.ReactNativeWebView.postMessage(JSON.stringify(payload)); }
  function run(){
    try {
      var secureData = { authData: ${authData}, cardData: ${cardData} };
      Accept.dispatchData(secureData, function(response){
        if (response.messages.resultCode === 'Ok') {
          send({ type: 'success', opaqueData: response.opaqueData });
        } else {
          var m = response.messages.message && response.messages.message[0];
          send({ type: 'error', message: (m && m.text) || 'Your card could not be processed.' });
        }
      });
    } catch (e) {
      send({ type: 'error', message: (e && e.message) ? e.message : 'Payment error.' });
    }
  }
  var tries = 0;
  var timer = setInterval(function(){
    tries++;
    if (typeof Accept !== 'undefined') { clearInterval(timer); run(); }
    else if (tries > 50) { clearInterval(timer); send({ type: 'error', message: 'Payment library failed to load. Check your connection.' }); }
  }, 100);
</script>
</body>
</html>`;
}

export const PaymentTokenizer = forwardRef<PaymentTokenizerHandle>(function PaymentTokenizer(
  _props,
  ref,
) {
  const [pending, setPending] = useState<PendingState | null>(null);
  const resolverRef = useRef<Resolver | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    resolverRef.current = null;
    setPending(null);
  };

  useImperativeHandle(ref, () => ({
    tokenize: (publicKey, card) =>
      new Promise<PaymentOpaqueData>((resolve, reject) => {
        resolverRef.current = { resolve, reject };
        timeoutRef.current = setTimeout(() => {
          resolverRef.current?.reject(new Error('Card verification timed out. Please try again.'));
          cleanup();
        }, TIMEOUT_MS);
        setPending({ html: buildHtml(publicKey, card) });
      }),
  }));

  const onMessage = (event: WebViewMessageEvent) => {
    let payload: { type: string; opaqueData?: PaymentOpaqueData; message?: string };
    try {
      payload = JSON.parse(event.nativeEvent.data);
    } catch {
      resolverRef.current?.reject(new Error('Unexpected payment response.'));
      cleanup();
      return;
    }
    if (payload.type === 'success' && payload.opaqueData) {
      resolverRef.current?.resolve(payload.opaqueData);
    } else {
      resolverRef.current?.reject(new Error(payload.message ?? 'Your card could not be processed.'));
    }
    cleanup();
  };

  if (!pending) return null;

  return (
    <View style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} pointerEvents="none">
      <WebView
        originWhitelist={['*']}
        source={{ html: pending.html, baseUrl: 'https://booking.zap-zone.com' }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={onMessage}
        onError={() => {
          resolverRef.current?.reject(new Error('Payment could not be initialized.'));
          cleanup();
        }}
      />
    </View>
  );
});
