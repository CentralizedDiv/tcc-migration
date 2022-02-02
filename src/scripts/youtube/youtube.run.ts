import { loopAndParse, saveContent } from "../../utils";
import {
  youtubeDiscussionParser,
  youtubeCommentsParser,
} from "./youtube.functions";

// Youtube Discussions
try {
  const discussions = loopAndParse(
    "D://workfolder//tcc//__original_databases//youtube//domains.jsonl",
    youtubeDiscussionParser
  );

  saveContent(
    "D://workfolder//tcc//__unified_database//discussions.json",
    "discussions",
    "YOUTUBE",
    discussions
  );
} catch (err) {
  console.error(err);
}

// Youtube Comments
try {
  const comments = loopAndParse(
    "D://workfolder//tcc//__original_databases//youtube//comments.jsonl",
    youtubeCommentsParser
  );

  saveContent(
    "D://workfolder//tcc//__unified_database//comments.json",
    "comments",
    "YOUTUBE",
    comments
  );
} catch (err) {
  console.error(err);
}
