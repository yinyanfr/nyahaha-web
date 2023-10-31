export function calculateTagConcurrences(songs: Song[]) {
  const concurrences: Record<string, number> = {};
  songs.forEach(song => {
    song.tags.forEach(tag => {
      if (concurrences[tag]) {
        concurrences[tag]++;
      } else {
        concurrences[tag] = 1;
      }
    });
  });
  const list = Object.keys(concurrences).map(tag => ({
    tag,
    concurrence: concurrences[tag],
  }));
  list.sort((a, b) => b.concurrence - a.concurrence);
  return list.map(e => e.tag);
}

export function cleanYoutubeLink(link: string) {
  // https://www.youtube.com/watch?v=44-fbGUYGL0&pp=ygUSamV3ZWxyeSBkYXkg57Wi6aaZ
  const match = link.match(/\?v=([^&]+)/);
  if (match) {
    return match[1];
  }
  return link;
}
