const JSONStream = require("JSONStream");
import * as fs from "fs";
import * as es from "event-stream";

import progress from "progress-stream";

import { Comment, Discussion, Parser } from "./types";
import { PassThrough, Stream } from "stream";

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
        process.stdout.write(`${progress.percentage.toFixed(2)}%`);
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
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          console.log(`${path}: Done`);
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

export const isValidDate = (date: Date) => {
  return date instanceof Date && !isNaN(date as unknown as number);
};

const merge = (...streams: Stream[]) => {
  let pass = new PassThrough();
  let waiting = streams.length;
  for (let stream of streams) {
    pass = stream.pipe(pass, { end: false });
    stream.once("end", () => --waiting === 0 && pass.emit("end"));
  }
  return pass;
};
