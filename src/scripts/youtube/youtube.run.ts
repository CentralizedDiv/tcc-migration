import {
  loopAndParse,
  originalDatabasesDir,
  unifiedDatabasesDir,
} from "../../utils";
import {
  youtubeDiscussionParser,
  youtubeCommentsParser,
} from "./youtube.functions";

export default async function () {
  // Youtube Discussions
  try {
    await loopAndParse(
      [originalDatabasesDir + "youtube//domains.jsonl"],
      unifiedDatabasesDir + "youtube.discussions.json",
      youtubeDiscussionParser
    );
  } catch (err) {
    console.error(err);
  }

  // Youtube Comments
  try {
    await loopAndParse(
      [originalDatabasesDir + "/youtube/comments.jsonl"],
      unifiedDatabasesDir + "youtube.comments.json",
      youtubeCommentsParser
    );
  } catch (err) {
    console.error(err);
  }
}
