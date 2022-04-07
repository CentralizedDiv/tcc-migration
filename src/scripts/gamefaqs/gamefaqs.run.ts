import { loopAndParse } from "../../utils";
import {
  gamefaqsDiscussionParser,
  gamefaqsCommentsParser,
} from "./gamefaqs.functions";

const base_path = "D://workfolder//tcc//";

(async function () {
  // gamefaqs Discussions
  try {
    await loopAndParse(
      base_path + "__original_databases//gamefaqs//lista_topicos.txt",
      base_path + "__unified_database//gamefaqs.discussions.json",
      gamefaqsDiscussionParser
    );
  } catch (err) {
    console.error(err);
  }

  // gamefaqs Comments
  try {
    await loopAndParse(
      base_path + "__original_databases//comseqs//comseqs_gamefaqs.jsonl",
      base_path + "__unified_database//gamefaqs.comments.json",
      gamefaqsCommentsParser
    );
  } catch (err) {
    console.error(err);
  }
})();
