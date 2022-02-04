import fs from "fs";
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
): T[] => {
  let discussions: T[] = [];
  try {
    const data = fs.readFileSync(path, "utf8");
    discussions = data
      .split(splitter)
      .map((original) => {
        if (typeof original === "string") {
          try {
            return JSON.parse(original);
          } catch (err) {
            return original;
          }
        }
        return original;
      })
      .map(parser);
  } catch (err) {
    console.error(err);
  }
  return discussions;
};

export const saveContent = <T extends { system: string }>(
  path: string,
  system: string,
  content: T[]
) => {
  const oldContent = JSON.parse(fs.readFileSync(path, "utf8"));
  const contentToSpread = oldContent.filter((row: T) => row.system !== system);

  fs.writeFileSync(path, JSON.stringify([...contentToSpread, ...content]));
};
