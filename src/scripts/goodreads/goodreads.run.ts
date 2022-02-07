import { loopAndParse, saveContent } from "../../utils";
import {
  goodreadsDiscussionParser,
  goodreadsCommentsParser,
} from "./goodreads.functions";

(async function () {
  // goodreads Discussions
  try {
    const discussions = await loopAndParse(
      "D://workfolder//tcc//__original_databases//goodreads//titles.txt",
      goodreadsDiscussionParser
    );

    saveContent(
      "D://workfolder//tcc//__unified_database//discussions.json",
      "GOODREADS",
      discussions
    );
  } catch (err) {
    console.error(err);
  }

  // goodreads Comments
  try {
    const comments = await loopAndParse(
      "D://workfolder//tcc//__original_databases//goodreads//comments.jl",
      goodreadsCommentsParser
    );

    saveContent(
      "D://workfolder//tcc//__unified_database//comments.json",
      "GOODREADS",
      comments
    );
  } catch (err) {
    console.error(err);
  }
})();
