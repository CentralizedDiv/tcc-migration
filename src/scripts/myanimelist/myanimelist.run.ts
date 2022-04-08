import { loopAndParse } from "../../utils";
import {
  myanimelistDiscussionParser,
  myanimelistCommentsParser,
} from "./myanimelist.functions";

const base_path = "D://workfolder//tcc//";

export default async function () {
  // myanimelist Discussions
  try {
    await loopAndParse(
      [
        "lista_topicos.txt",
        "lista_topicos-20190214.txt",
        "lista_topicos-20190211.txt",
        "lista_topicos-20181030.txt",
        "lista_topicos-20180624que.txt",
      ].map((path) => base_path + "__original_databases//myanimelist//" + path),
      base_path + "__unified_database//myanimelist.discussions.json",
      myanimelistDiscussionParser
    );
  } catch (err) {
    console.error(err);
  }

  // myanimelist Comments
  try {
    await loopAndParse(
      [
        "comentarios-MALFITT.jsonlines",
        "comentarios-myanimelist-20180502.jsonlines",
        "comentarios-myanimelist-20180503.jsonlines",
        "comentarios-myanimelist-20180507.jsonlines",
        "comentarios-myanimelist-20181030.jsonlines",
        "comentarios-myanimelist-20190211.jsonlines",
        "comentarios-myanimelist-20190214.jsonlines",
        "comentarios-myanimelist-20190225.jsonlines",
      ].map((path) => base_path + "__original_databases//myanimelist//" + path),
      base_path + "__unified_database//myanimelist.comments.json",
      myanimelistCommentsParser
    );
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}
