import { ApiHandler } from "sst/node/api";
import * as cheerio from 'cheerio';
import axios from 'axios';

// Browser-ish headers so UG is less likely to block the request.
const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

// UG embeds page data as JSON in <div class="js-store" data-content="...">.
function parseStore(html: string): any | null {
  const $ = cheerio.load(html);
  const raw = $('.js-store').attr('data-content');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

interface UGResult {
  tab_url?: string;
  type?: string;        // "Chords", "Tab", "Pro", "Official", "Bass Tabs", ...
  artist_name?: string;
  song_name?: string;
  rating?: number;
  votes?: number;
}

// Hit UG's own search endpoint and return the best "Chords" match.
function pickBestChords(store: any): UGResult | null {
  const results: UGResult[] = store?.store?.page?.data?.results ?? [];
  if (!Array.isArray(results) || results.length === 0) return null;

  const chords = results.filter(
    (r) => r.type === 'Chords' && typeof r.tab_url === 'string'
  );
  if (chords.length === 0) return null;

  // Highest rating, then most votes.
  chords.sort((a, b) => {
    const r = (b.rating ?? 0) - (a.rating ?? 0);
    if (r !== 0) return r;
    return (b.votes ?? 0) - (a.votes ?? 0);
  });
  return chords[0];
}

// Pull raw chord-over-lyric content from a tab page (markers stripped).
function extractTabContent(store: any): string | null {
  const content: string | undefined =
    store?.store?.page?.data?.tab_view?.wiki_tab?.content;
  if (!content) return null;

  return content
    .replace(/\[\/?ch\]/g, '')
    .replace(/\[\/?tab\]/g, '')
    .replace(/\r\n/g, '\n')
    .trim();
}

export const handler = ApiHandler(async (_evt) => {
  const { artist = '', song = '' } = _evt.queryStringParameters || {};
  const jsonHeaders = { 'Content-Type': 'application/json' };

  if (!artist || !song) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'artist and song are required' }),
    };
  }

  const query = encodeURIComponent(`${artist} ${song}`);

  try {
    // 1. Search UG directly (no Google hop).
    const { data: searchHtml } = await axios.get(
      `https://www.ultimate-guitar.com/search.php?search_type=title&value=${query}`,
      { headers: BROWSER_HEADERS }
    );
    const searchStore = parseStore(searchHtml);
    const best = pickBestChords(searchStore);

    if (!best?.tab_url) {
      return {
        statusCode: 404,
        headers: jsonHeaders,
        body: JSON.stringify({ error: 'No Ultimate Guitar chords found for that song.' }),
      };
    }

    // 2. Fetch the winning tab page and scrape chords + lyrics.
    const { data: tabHtml } = await axios.get(best.tab_url, { headers: BROWSER_HEADERS });
    const tabStore = parseStore(tabHtml);
    const content = extractTabContent(tabStore);

    return {
      statusCode: 200,
      headers: jsonHeaders,
      body: JSON.stringify({
        parsedUrl: best.tab_url,
        artist: best.artist_name,
        song: best.song_name,
        rating: best.rating,
        votes: best.votes,
        content,
      }),
    };
  } catch (error: any) {
    console.log(error);
    return {
      statusCode: 502,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Failed to fetch song', detail: error?.message }),
    };
  }
});
