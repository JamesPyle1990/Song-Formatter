// Song Formatter UG Grabber
//
// Runs only when the Song Formatter app opened this tab (marked with ?sf=1).
// Search page -> auto-navigate to the best Chords result.
// Tab page    -> grab the chords text, post it to the opener app, close the tab.

(function () {
  const AUTO_KEY = "sf_auto";

  // Was this tab opened by the app? Marker is in the URL on the first (search)
  // page; we persist it in sessionStorage so it survives the navigation to the
  // chords page (same origin, same tab).
  const urlHasMarker = new URLSearchParams(location.search).get("sf") === "1";
  if (urlHasMarker) sessionStorage.setItem(AUTO_KEY, "1");
  const auto = sessionStorage.getItem(AUTO_KEY) === "1";
  if (!auto) return;

  // --- Tab (chords) page: grab and send ---------------------------------
  const codeEl = document.querySelector("code");
  if (codeEl && codeEl.innerText.trim()) {
    const content = codeEl.innerText.replace(/\r\n/g, "\n").trim();
    sessionStorage.removeItem(AUTO_KEY);
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(
        { type: "SONG_FORMATTER_LYRICS", content },
        "*"
      );
      // Give the message a tick to flush, then close this tab.
      setTimeout(() => window.close(), 150);
    } else {
      navigator.clipboard.writeText(content).catch(() => {});
    }
    return;
  }

  // --- Search results page: pick the first Chords result and go there ---
  // UG encodes the tab type in the URL slug: chords pages end with
  // "-chords-<id>", which lets us skip Official / Pro / Tabs / Bass versions.
  const findChordsLink = () => {
    const links = [...document.querySelectorAll('a[href*="/tab/"]')];
    const chord = links
      .map((a) => a.href)
      .find((href) => /-chords-\d+/i.test(href));
    return chord || null;
  };

  // Results are rendered by React after load, so retry briefly until they show.
  let tries = 0;
  const tryNavigate = () => {
    const link = findChordsLink();
    if (link) {
      // Carry the marker across the (cross-subdomain) navigation, since
      // sessionStorage doesn't survive www -> tabs.ultimate-guitar.com.
      const sep = link.includes("?") ? "&" : "?";
      location.href = link + sep + "sf=1";
      return;
    }
    if (++tries < 20) {
      setTimeout(tryNavigate, 250); // up to ~5s
    } else {
      sessionStorage.removeItem(AUTO_KEY);
    }
  };
  tryNavigate();
})();
