import { ApiHandler } from "sst/node/api";
import * as cheerio from 'cheerio';
import axios from 'axios';

export const handler = ApiHandler(async (_evt) => {
  const url = 'https://www.ultimate-guitar.com/search.php?search_type=title&value=john%20mayer%20slow%20dancing%20in%20a%20burning%20room';

  axios.get('https://scrapeme.live/shop/') 
	.then(({ data }) => { 
		const $ = cheerio.load(data); 
 
		const pokemonNames = $('.woocommerce-loop-product__title') 
			.map((_, product) => { 
				const $product = $(product); 
				return $product.text() 
			}) 
			.toArray(); 
		console.log(pokemonNames) 
	});

  axios.get('https://www.google.com/search?q=john+myer+gravity+chords&oq=john+mayer+gravity+chords')
  .then(({ data }) => { 
		const $ = cheerio.load(data); 

    const $a = $('div > a:contains("ultimate-guitar")');
    const url = $a.attr('href');
    console.log(url);
    
    function parseUrl(url) {
      var parts = url.split('q=');
      if(parts.length > 1) {
          var subparts = parts[1].split('&');
          if(subparts.length > 0) {
              return decodeURIComponent(subparts[0]);
          }
      }
      return null;
    }
    
    var url2 = "/url?q=https://tabs.ultimate-guitar.com/tab/john-mayer/gravity-chords-641307&sa=U&ved=2ahUKEwjPl5Tp84mAAxUGkokEHcarBmkQFnoECAAQAg&usg=AOvVaw0nI4roku21PTSZe3-XAZKO";
    var parsedUrl = parseUrl(url2);
    console.log(parsedUrl);  
})
.catch(error => {
    console.log(error);
});




});
