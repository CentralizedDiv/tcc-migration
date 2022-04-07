const JSONStream = require("JSONStream");
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
  destPath: string,
  parser: Parser<T>,
  splitter: string = "\n"
) => {
  const promise = new Promise<void>((resolve, reject) => {
    try {
      // Write Stream
      const transformStream = JSONStream.stringify("[", ",\n", "]");
      const stream = fs.createWriteStream(destPath, { flags: "w" });
      transformStream.pipe(stream);

      // Progress
      const stat = fs.statSync(path);
      const str = progress({
        length: stat.size,
        time: 100,
      });
      str.on("progress", function (progress) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`Reading: ${progress.percentage.toFixed(2)}%`);
      });

      console.log(`\n${path}: Start`);
      const readStream = fs
        .createReadStream(path, "utf8")
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
            readStream.pause();
            const parsed = parser(line);
            let ok = true;
            if (parsed) {
              ok = transformStream.write(parsed);
            }
            if (ok) {
              readStream.resume();
            } else {
              transformStream.once("drain", function () {
                readStream.resume();
              });
            }
          })
        )
        .on("error", function (err) {
          console.log(`\n${path} - Error: ${err}`);
          transformStream.end();
          reject();
        })
        .on("end", function () {
          console.log(`\n${path}: Done`);
          transformStream.end();
          resolve();
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
  content: T[]
) => {
  try {
    const transformStream = JSONStream.stringify();
    const stream = fs.createWriteStream(path, { flags: "w" });
    transformStream.pipe(stream);

    content.forEach((obj, idx, arr) => {
      transformStream.write(obj);

      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(
        `Writing: ${((idx / arr.length) * 100).toFixed(2)}%`
      );
    });
    transformStream.end();
  } catch (err) {
    console.log("saveContent", err);
  }
};

export const isValidDate = (date: Date) => {
  return date instanceof Date && !isNaN(date as unknown as number);
};
