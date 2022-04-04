import { loopAndParse, saveContent } from "../../utils";
import {
  myanimelistDiscussionParser,
  myanimelistCommentsParser,
} from "./myanimelist.functions";
import { Discussion } from "../../types";

const base_path = "F://tcc//";

(async function () {
  // myanimelist Discussions
  try {
    const files = [
      "lista_topicos.txt",
      "lista_topicos-20190214.txt",
      "lista_topicos-20190211.txt",
      "lista_topicos-20181030.txt",
      "lista_topicos-20180624que.txt",
    ];
    const discussions = [];
    for (let path of files) {
      const fileDiscussions = (
        (await loopAndParse(
          base_path + "__original_databases//myanimelist//" + path,
          myanimelistDiscussionParser
        )) as Discussion[]
      ).filter((c) => c !== undefined);
      discussions.push(...fileDiscussions);
    }

    saveContent(
      base_path + "__unified_database//myanimelist.discussions.json",
      "MYANIMELIST",
      discussions
    );
  } catch (err) {
    console.error(err);
  }

  // myanimelist Comments
  try {
    const files = [
      "comentarios-MALFITT.jsonlines",
      // "comentarios-myanimelist-20180502.jsonlines",
      // "comentarios-myanimelist-20180503.jsonlines",
      // "comentarios-myanimelist-20180507.jsonlines",
      // "comentarios-myanimelist-20181030.jsonlines",
      // "comentarios-myanimelist-20190211.jsonlines",
      // "comentarios-myanimelist-20190214.jsonlines",
      // "comentarios-myanimelist-20190225.jsonlines",
    ];
    const comments = [];
    for (let path of files) {
      const fullPath = base_path + "__original_databases//myanimelist//" + path;
      const fileComments = (
        (await loopAndParse(
          fullPath,
          myanimelistCommentsParser
        )) as Discussion[]
      ).filter((c) => c !== undefined);
      comments.push(...fileComments);
    }

    saveContent(
      base_path + "__unified_database//myanimelist.comments.json",
      "MYANIMELIST",
      comments
    );
  } catch (err) {
    console.error(`Error: ${err}`);
  }
})();
