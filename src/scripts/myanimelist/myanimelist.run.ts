import { loopAndParse, saveContent } from "../../utils";
import {
  myanimelistDiscussionParser,
  myanimelistCommentsParser,
} from "./myanimelist.functions";

import * as es from "event-stream";
import * as fs from "fs";

(async function () {
  // myanimelist Discussions
  // try {
  //   const files = [
  //     "lista_topicos.txt",
  //     "lista_topicos-20190214.txt",
  //     "lista_topicos-20190211.txt",
  //     "lista_topicos-20181030.txt",
  //     "lista_topicos-20180624que.txt",
  //   ];
  //   const discussions = [];
  //   for (let file of files) {
  //     const fileDiscussions = (
  //       (await loopAndParse(
  //         "D://workfolder//tcc//__original_databases//myanimelist//" + file,
  //         myanimelistDiscussionParser
  //       )) as Discussion[]
  //     ).filter((c) => c !== undefined);
  //     discussions.push(...fileDiscussions);
  //   }

  //   saveContent(
  //     "D://workfolder//tcc//__unified_database//discussions.json",
  //     "MYANIMELIST",
  //     discussions
  //   );
  // } catch (err) {
  //   console.error(err);
  // }

  // myanimelist Comments
  try {
    const files = [
      // "comentarios-MALFITT.jsonlines",
      // "comentarios-myanimelist-20180502.jsonlines",
      // "comentarios-myanimelist-20180503.jsonlines",
      // "comentarios-myanimelist-20180507.jsonlines",
      // "comentarios-myanimelist-20181030.jsonlines",
      // "comentarios-myanimelist-20190211.jsonlines",
      // "comentarios-myanimelist-20180214.jsonlines",
      // "comentarios-myanimelist-20190225.jsonlines",
    ];
    const writeStream = fs.createWriteStream(
      "D://workfolder//tcc//__unified_database//myanimelist.comments.json"
    );
    writeStream.write("[");
    let count = 0;
    fs.createReadStream(
      "D://workfolder//tcc//__original_databases//myanimelist//comentarios-myanimelist-20180502.jsonlines",
      "utf8"
    )
      .pipe(es.split())
      .pipe(
        es.mapSync((original: any) => {
          if (typeof original === "string") {
            try {
              return JSON.parse(original);
            } catch (err) {
              return original;
            }
          }
          return original;
        })
      )
      .pipe(
        es.mapSync((line) => {
          if (count > 0) writeStream.write(",");
          count++;
          console.log(count);
          const parsed = myanimelistCommentsParser(line);
          if (parsed) writeStream.write(JSON.stringify(parsed));
        })
      )
      .on("end", function () {
        writeStream.write("]");
        writeStream.end();
      });
    //   (
    //   await loopAndParse(
    //     "D://workfolder//tcc//__original_databases//myanimelist//" + file,
    //     myanimelistCommentsParser,
    //     "\n",
    //     true
    //   )
    // ) as fs.ReadStream;

    // This pipes the POST data to the file
    // comments.push(...fileComments);
    // saveContent(
    //   "D://workfolder//tcc//__unified_database//myanimelist.comments.json",
    //   "MYANIMELIST",
    //   fileComments
    // );
  } catch (err) {
    console.error(err);
  }
})();
