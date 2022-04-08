import movietalk from "./scripts/movietalk/movietalk.run";
import youtube from "./scripts/youtube/youtube.run";
import reddit from "./scripts/reddit/reddit.run";
import goodreads from "./scripts/goodreads/goodreads.run";
import myanimelist from "./scripts/myanimelist/myanimelist.run";
import gamefaqs from "./scripts/gamefaqs/gamefaqs.run";

(async function () {
  await movietalk();
  // await youtube();
  // await reddit();
  // await goodreads();
  // await gamefaqs();
  // await myanimelist();
})();
