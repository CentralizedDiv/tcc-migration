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
  splitter: string = "\n"
) => {
  let result: T[] = [];
  let stream: fs.ReadStream;
  const promise = new Promise<T[]>((resolve, reject) => {
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
          es.mapSync((line: any) => {
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
    let fileContent: string;
    try {
      fileContent = fs.readFileSync(path, "utf8");
    } catch {
      fileContent = "[]";
    }
    const oldContent = JSON.parse(fileContent);
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
