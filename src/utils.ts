const JSONStream = require("JSONStream");
import * as readline from "readline";
import * as fs from "fs";
import * as es from "event-stream";
import progress from "progress-stream";
import { Parser } from "./types";
import { PassThrough, Stream } from "stream";

export const loopAndParse = <T>(
  paths: string[],
  destPath: string,
  parser: Parser<T>,
  splitter: string = "\n"
) => {
  const promise = new Promise<void>(async (resolve, reject) => {
    try {
      // Write Stream
      const transformStream = JSONStream.stringify("[", ",\n", "]");
      const stream = fs.createWriteStream(destPath, { flags: "w" });
      transformStream.pipe(stream);

      for (let [index, path] of paths.entries()) {
        await new Promise<void>((fileResolve) => {
          // Progress
          const stat = fs.statSync(path);
          const str = progress({
            length: stat.size,
            time: 100,
          });
          str.on("progress", function (progress) {
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0);
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
              fileResolve();
              reject();
            })
            .on("end", function () {
              readline.clearLine(process.stdout, 0);
              readline.cursorTo(process.stdout, 0);
              console.log(`${path}: Done`);
              fileResolve();
              if (index === paths.length - 1) {
                transformStream.end();
                resolve();
              }
            });
        });
      }
    } catch (err) {
      console.error(`\n ${err}`);
      reject();
    }
  }).catch(() => {
    return null;
  });
  return promise;
};

export const isValidDate = (date: Date) => {
  return date instanceof Date && !isNaN(date as unknown as number);
};

export const rootDir = __dirname + "/../";
export const originalDatabasesDir = rootDir + "__original_databases/";
export const unifiedDatabasesDir = rootDir + "__unified_database/";
