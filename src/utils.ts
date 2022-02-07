import * as fs from "fs";
import * as es from "event-stream";
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
  splitter: string = "\n",
  returnStream: boolean = false
) => {
  let result: T[] = [];
  let stream: fs.ReadStream;
  const promise = new Promise((resolve, reject) => {
    try {
      console.log(`${path}: Start`);
      stream = fs.createReadStream(path, "utf8");
      stream
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
          es.mapSync((line) => {
            const parsed = parser(line);
            result.push(parsed);
            return parsed;
          })
        )
        .on("error", function (err) {
          console.log(`${path} - Error: ${err}`);
          reject();
        })
        .on("end", function () {
          console.log(`${path}: Done`);
          resolve(result);
        });
    } catch (err) {
      console.error(err);
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
    const fileContent = fs.readFileSync(path, "utf8");
    const oldContent = JSON.parse(fileContent);
    const contentToSpread = oldContent.filter(
      (row: T) => row.system !== system
    );

    fs.writeFileSync(path, JSON.stringify([...contentToSpread, ...content]));
  } catch (err) {
    console.log("saveContent", err);
  }
};
