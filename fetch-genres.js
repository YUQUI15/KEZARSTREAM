const genres = [28,35,27,18,12,16,10751,14,878,53,10749,80,9648,36,10752,37,99,10770,10759,10765,10768,10762,10767,10766,10764,10763];
const paths = {};
async function run() {
  for (const id of genres) {
    const type = id > 10000 && id !== 10751 && id !== 10749 && id !== 10752 && id !== 10770 ? 'tv' : 'movie';
    const res = await fetch(`https://api.themoviedb.org/3/discover/${type}?api_key=982fb6b40e028e8fdd07a9116b40bcd6&with_genres=${id}&sort_by=popularity.desc`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      paths[id] = data.results[0].backdrop_path || data.results[1]?.backdrop_path;
    }
  }
  console.log(JSON.stringify(paths, null, 2));
}
run();
