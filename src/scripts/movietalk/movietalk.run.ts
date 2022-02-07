import { loopAndParse, saveContent } from "../../utils";
import {
  movietalkDiscussionParser,
  movietalkCommentsParser,
} from "./movietalk.functions";

(async function () {
  // Reddit Discussions
  try {
    const discussions = (
      await loopAndParse(
        "D://workfolder//tcc//__original_databases//movietalk//topicos.jsonlines",
        movietalkDiscussionParser
      )
    ).filter((d) => d !== undefined);

    saveContent(
      "D://workfolder//tcc//__unified_database//discussions.json",
      "MOVIETALK",
      discussions
    );
  } catch (err) {
    console.error(err);
  }

  // Reddit Comments
  try {
    const files = [
      "comentarios-movietalk-2pg-20180417.jsonl",
      "comentarios-movietalk-20180418.jsonl",
      "comentarios-movietalk-20180426.jsonlines",
    ];
    const comments = [];
    for (let file of files) {
      const fileComments = (
        await loopAndParse(
          "D://workfolder//tcc//__original_databases//movietalk//" + file,
          movietalkCommentsParser
        )
      ).filter((c) => c !== undefined);
      comments.push(...fileComments);
    }

    saveContent(
      "D://workfolder//tcc//__unified_database//comments.json",
      "MOVIETALK",
      comments
    );
  } catch (err) {
    console.error(err);
  }
})();
