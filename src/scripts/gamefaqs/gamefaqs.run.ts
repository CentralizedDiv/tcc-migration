import {
  loopAndParse,
  originalDatabasesDir,
  unifiedDatabasesDir,
} from "../../utils";
import {
  gamefaqsDiscussionParser,
  gamefaqsCommentsParser,
} from "./gamefaqs.functions";

export default async function () {
  // gamefaqs Discussions
  try {
    await loopAndParse(
      [originalDatabasesDir + "gamefaqs/lista_topicos.txt"],
      unifiedDatabasesDir + "gamefaqs.discussions.json",
      gamefaqsDiscussionParser
    );
  } catch (err) {
    console.error(err);
  }

  // gamefaqs Comments
  try {
    await loopAndParse(
      [originalDatabasesDir + "comseqs/comseqs_gamefaqs.jsonl"],
      unifiedDatabasesDir + "gamefaqs.comments.json",
      gamefaqsCommentsParser
    );
  } catch (err) {
    console.error(err);
  }
}
