export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/chess/')) {
      const target = 'https://api.chess.com' + url.pathname.replace(/^\/chess/, '') + url.search;
      const upstream = await fetch(target, {
        headers: {
          // Swap in your own email before deploying — chess.com blocks
          // requests that don't identify a real app with a real contact.
          'User-Agent': 'brilliant-chess-app/1.0 (contact: chessnerd118@gmail.com)'
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

    // Anything that isn't /chess/* is the site itself — hand it to the
    // static assets Cloudflare uploaded from this same repo.
    return env.ASSETS.fetch(request);
  }
};
