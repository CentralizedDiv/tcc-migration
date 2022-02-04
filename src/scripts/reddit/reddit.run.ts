import { Comment } from "../../types";
import { loopAndParse, saveContent } from "../../utils";
import {
  redditDiscussionParser,
  redditCommentsParser,
} from "./reddit.functions";

// Reddit Discussions
try {
  const discussions = loopAndParse(
    "D://workfolder//tcc//__original_databases//reddit//domains.jsonl",
    redditDiscussionParser
  );

  saveContent(
    "D://workfolder//tcc//__unified_database//discussions.json",
    "REDDIT",
    discussions
  );
} catch (err) {
  console.error(err);
}

// Reddit Comments
try {
  const comments = ["comedy.jsonl", "drama.jsonl", "medical.jsonl"].reduce(
    (acc, file) => [
      ...acc,
      ...loopAndParse(
        "D://workfolder//tcc//__original_databases//reddit//comments//" + file,
        redditCommentsParser
      ),
    ],
    [] as Comment[]
  );

  saveContent(
    "D://workfolder//tcc//__unified_database//comments.json",
    "REDDIT",
    comments
  );
} catch (err) {
  console.error(err);
}
