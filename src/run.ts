// require("./generate-base-files");

// require("./scripts/reddit/reddit.run");
// require("./scripts/youtube/youtube.run");
// require("./scripts/goodreads/goodreads.run");
// require("./scripts/movietalk/movietalk.run");
require("./scripts/myanimelist/myanimelist.run");
// require("./scripts/gamefaqs/gamefaqs.run");

// import { PassThrough, Stream } from "stream";
// import * as es from "event-stream";
// const merge = (...streams: Stream[]) => {
//   let pass = new PassThrough();
//   let waiting = streams.length;
//   for (let stream of streams) {
//     pass = stream.pipe(pass, { end: false });
//     stream.once("end", () => --waiting === 0 && pass.emit("end"));
//   }
//   return pass;
// };

// import * as fs from "fs";
// const streams = [
//   "lista_topicos.txt",
//   "lista_topicos-20190214.txt",
//   "lista_topicos-20190211.txt",
//   "lista_topicos-20181030.txt",
//   "lista_topicos-20180624que.txt",
// ].map((path) =>
//   fs.createReadStream(
//     "D://workfolder//tcc//__original_databases//myanimelist//" + path,
//     "utf8"
//   )
// );
// let c = 0;
// let map = {};
// const readStream = merge(...streams)
//   .pipe(es.split("\n"))
//   .pipe(
//     es.mapSync((a: any) => {
//       const [id, partialUrl, title] = a.split("\t");
//       if (!map.hasOwnProperty(id)) {
//         map[id] = title;
//         c++;
//       }
//       console.log(c);
//     })
//   );
