import {
  loopAndParse,
  originalDatabasesDir,
  unifiedDatabasesDir,
} from "../../utils";
import {
  goodreadsDiscussionParser,
  goodreadsCommentsParser,
} from "./goodreads.functions";

export default async function () {
  // goodreads Discussions
  try {
    await loopAndParse(
      [originalDatabasesDir + "goodreads/titles.txt"],
      unifiedDatabasesDir + "goodreads.discussions.json",
      goodreadsDiscussionParser
    );
  } catch (err) {
    console.error(err);
  }

  // goodreads Comments
  try {
    await loopAndParse(
      [originalDatabasesDir + "goodreads/comments.jl"],
      unifiedDatabasesDir + "goodreads.comments.json",
      goodreadsCommentsParser
    );
  } catch (err) {
    console.error(err);
  }
}
