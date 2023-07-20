import { ApiHandler } from "sst/node/api";
import * as cheerio from 'cheerio';
import axios from 'axios';

export const handler = ApiHandler(async (_evt) => {
  const { artist = 'john mayer', song = 'slow dancing in a burning room' } = _evt.queryStringParameters || {};

  // URL encode the parameters
  const encodedArtist = encodeURIComponent(artist);
  const encodedSong = encodeURIComponent(song);

  return axios.get(`https://www.google.com/search?q=${encodedArtist}+${encodedSong}+chords`)
    .then(({ data }) => {
      const $ = cheerio.load(data);
      console.log($.html());
      const googleResult = $('div > a:contains("ultimate-guitar")');
      const url = googleResult.attr('href');
      console.log(url);

      function parseUrl(url) {
        var parts = url.split('q=');
        if (parts.length > 1) {
          var subparts = parts[1].split('&');
          if (subparts.length > 0) {
            return decodeURIComponent(subparts[0]);
          }
        }
        return null;
      }
      var parsedUrl = parseUrl(url);
      console.log(parsedUrl);
      return { parsedUrl };
    })


    .catch(error => {
      console.log(error);
    });
});