export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const titles = new URL(request.url, 'http://localhost').searchParams.getAll('title');
  const title = titles[0]?.trim();
  if (titles.length !== 1 || !title || title.length > 300) {
    return response.status(400).json({ error: 'Provide one game title, up to 300 characters.' });
  }
  const key = process.env.RAWG_KEY;
  if (!key) {
    return response.status(503).json({ error: 'Game details are not configured.' });
  }

  try {
    const searchUrl = new URL('https://api.rawg.io/api/games');
    searchUrl.search = new URLSearchParams({ search: title, key, page_size: '1' });
    const searchResponse = await fetch(searchUrl, { signal: AbortSignal.timeout(10000) });
    if (!searchResponse.ok) throw new Error('Search failed');
    const searchData = await searchResponse.json();
    const game = searchData.results?.[0];
    let description = 'No description available.';
    let screenshots = [];
    if (game) {
      if (!Number.isSafeInteger(game.id) || game.id <= 0) throw new Error('Invalid game');
      const detailsUrl = new URL(`https://api.rawg.io/api/games/${game.id}`);
      detailsUrl.search = new URLSearchParams({ key });
      const detailsResponse = await fetch(detailsUrl, { signal: AbortSignal.timeout(10000) });
      if (!detailsResponse.ok) throw new Error('Details failed');
      const details = await detailsResponse.json();
      description = details.description_raw || description;
      screenshots = (game.short_screenshots || []).map(item => item.image).filter(url => typeof url === 'string');
    }
    response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    return response.status(200).json({ description, screenshots });
  } catch {
    // Do not forward upstream responses or URLs, which could contain the API key.
    return response.status(502).json({ error: 'Could not load game details.' });
  }
}
