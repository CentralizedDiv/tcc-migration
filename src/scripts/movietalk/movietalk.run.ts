import {
  loopAndParse,
  originalDatabasesDir,
  unifiedDatabasesDir,
} from "../../utils";
import {
  movietalkDiscussionParser,
  movietalkCommentsParser,
} from "./movietalk.functions";

export default async function () {
  // Reddit Discussions
  try {
    await loopAndParse(
      [originalDatabasesDir + "movietalk/topicos.jsonlines"],
      unifiedDatabasesDir + "movietalk.discussions.json",
      movietalkDiscussionParser
    );
  } catch (err) {
    console.error(err);
  }

  // Reddit Comments
  try {
    await loopAndParse(
      [
        "comentarios-movietalk-2pg-20180417.jsonl",
        "comentarios-movietalk-20180418.jsonl",
        "comentarios-movietalk-20180426.jsonlines",
      ].map((path) => originalDatabasesDir + "movietalk/" + path),
      unifiedDatabasesDir + "movietalk.comments.json",
      movietalkCommentsParser
    );
  } catch (err) {
    console.error(err);
  }
}
