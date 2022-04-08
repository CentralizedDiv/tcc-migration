import {
  loopAndParse,
  originalDatabasesDir,
  unifiedDatabasesDir,
} from "../../utils";
import {
  redditDiscussionParser,
  redditCommentsParser,
} from "./reddit.functions";

export default async function () {
  // Reddit Discussions
  try {
    await loopAndParse(
      [originalDatabasesDir + "reddit/domains.jsonl"],
      unifiedDatabasesDir + "reddit.discussions.json",
      redditDiscussionParser
    );
  } catch (err) {
    console.error(err);
  }

  // Reddit Comments
  try {
    await loopAndParse(
      ["comedy.jsonl", "drama.jsonl", "medical.jsonl"].map(
        (path) => originalDatabasesDir + "reddit/comments/" + path
      ),
      unifiedDatabasesDir + "/reddit.comments.json",
      redditCommentsParser
    );
  } catch (err) {
    console.error(err);
  }
}
