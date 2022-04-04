import { loopAndParse, saveContent } from "../../utils";
import {
  myanimelistDiscussionParser,
  myanimelistCommentsParser,
} from "./myanimelist.functions";

import * as es from "event-stream";
import * as fs from "fs";
import progress from "progress-stream";
import { Discussion } from "../../types";

const base_path = "F://tcc//";

(async function () {
  // myanimelist Discussions
  try {
    const files = [
      "lista_topicos.txt",
      "lista_topicos-20190214.txt",
      "lista_topicos-20190211.txt",
      "lista_topicos-20181030.txt",
      "lista_topicos-20180624que.txt",
    ];
    const discussions = [];
    for (let file of files) {
      const fileDiscussions = (
        (await loopAndParse(
          base_path + "__original_databases//myanimelist//" + file,
          myanimelistDiscussionParser
        )) as Discussion[]
      ).filter((c) => c !== undefined);
      discussions.push(...fileDiscussions);
    }

    saveContent(
      base_path + "__unified_database//myanimelist.discussions.json",
      "MYANIMELIST",
      discussions
    );
  } catch (err) {
    console.error(err);
  }

  // myanimelist Comments
  try {
    const writeStream = fs.createWriteStream(
      base_path + "__unified_database//myanimelist.comments.json"
    );
    writeStream.write("[");

    const files = [
      "comentarios-MALFITT.jsonlines",
      "comentarios-myanimelist-20180502.jsonlines",
      "comentarios-myanimelist-20180503.jsonlines",
      "comentarios-myanimelist-20180507.jsonlines",
      "comentarios-myanimelist-20181030.jsonlines",
      "comentarios-myanimelist-20190211.jsonlines",
      "comentarios-myanimelist-20190214.jsonlines",
      "comentarios-myanimelist-20190225.jsonlines",
    ];
    for (let path of files) {
      await new Promise((resolve) => {
        const fullPath =
          base_path + "__original_databases//myanimelist//" + path;

        try {
          const stat = fs.statSync(fullPath);
          const str = progress({
            length: stat.size,
            time: 100,
          });
          str.on("progress", function (progress) {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(progress.percentage.toFixed(2) + "%");
          });
          console.log(`${fullPath}: Start`);

          let count = 0;
          fs.createReadStream(fullPath, "utf8")
            .pipe(str)
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
              es.mapSync((line: any) => {
                if (count > 0) writeStream.write(",");
                count++;
                const parsed = myanimelistCommentsParser(line);
                if (parsed) writeStream.write(JSON.stringify(parsed));
              })
            )
            .on("end", function () {
              writeStream.write("]");
              writeStream.end();

              console.log(`\n${fullPath}: Done`);
              resolve(fullPath);
            })
            .on("error", function (err) {
              console.log(`\n${fullPath} - Error: ${err}`);
            });
        } catch (err) {
          console.log(`\n${fullPath} - Error: ${err}`);
        }
      });
    }
  } catch (err) {
    console.error(`Error: ${err}`);
  }
})();
