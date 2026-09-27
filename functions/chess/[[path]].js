// Cloudflare Pages Function.
// Deployed path: /functions/chess/[[path]].js
// Handles every request under /chess/* on your deployed site and forwards it
// to chess.com's public API, adding the CORS header chess.com itself never
// sends — which is why the site can't call chess.com directly from a browser.

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const targetPath = url.pathname.replace(/^\/chess/, '');
  const target = 'https://api.chess.com' + targetPath + url.search;

  const upstream = await fetch(target, {
    headers: {
      // Chess.com asks every client to identify itself with a real contact.
      // Swap in your own email before you deploy.
      'User-Agent': 'brilliant-chess-app/1.0 (contact: you@example.com)'
    }
  });

  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300'
    }
  });
}
