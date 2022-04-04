import * as fs from "fs";
import * as es from "event-stream";
import progress from "progress-stream";

import { Comment, Discussion, Parser } from "./types";

export const getDiscussions = (): Discussion[] => {
  return JSON.parse(
    fs.readFileSync(
      "D://workfolder//tcc//__unified_database//discussions.json",
      "utf8"
    )
  );
};

export const getComments = (): Comment[] => {
  return JSON.parse(
    fs.readFileSync(
      "D://workfolder//tcc//__unified_database//comments.json",
      "utf8"
    )
  );
};

export const loopAndParse = <T>(
  path: string,
  parser: Parser<T>,
  splitter: string = "\n"
) => {
  let result: T[] = [];
  const promise = new Promise<T[]>((resolve, reject) => {
    try {
      const stat = fs.statSync(path);
      const str = progress({
        length: stat.size,
        time: 100,
      });
      str.on("progress", function (progress) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(progress.percentage.toFixed(2) + "%");
      });

      console.log(`${path}: Start`);
      fs.createReadStream(path, "utf8")
        .pipe(str)
        .pipe(es.split(splitter))
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
            const parsed = parser(line);
            if (parsed) {
              result.push(parsed);
              return parsed;
            }
          })
        )
        .on("error", function (err) {
          console.log(`\n${path} - Error: ${err}`);
          reject();
        })
        .on("end", function () {
          console.log(`\n${path}: Done`);
          resolve(result);
        });
    } catch (err) {
      console.error(`\n ${err}`);
      reject();
    }
  }).catch(() => {
    return [];
  });
  return promise;
};

export const saveContent = <T extends { system: string }>(
  path: string,
  system: string,
  content: T[]
) => {
  try {
    let oldContent: any;
    try {
      const fileContent = fs.readFileSync(path, "utf8");
      oldContent = JSON.parse(fileContent ?? "[]");
    } catch {
      oldContent = [];
    }
    const contentToSpread = oldContent.filter(
      (row: T) => row.system !== system
    );

    fs.writeFileSync(path, JSON.stringify([...contentToSpread, ...content]), {
      flag: "w",
    });
  } catch (err) {
    console.log("saveContent", err);
  }
};
