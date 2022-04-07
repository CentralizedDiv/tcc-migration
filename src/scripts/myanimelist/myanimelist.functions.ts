import { Comment, Discussion, Parser } from "../../types";
import { v4 as uuid } from "uuid";
import * as fs from "fs";

type MyAnimeListRawDiscussion = string;
interface MyAnimeListDiscussion {
  id: string;
  partialUrl: string;
  title: string;
}

type MyAnimeListRawAnime = string;
interface MyAnimeListAnime {
  id: string;
  url: string;
  animeTitle: string;
}

interface MyAnimeListComment {
  aID: string;
  tID: string;
  c: string;
}

const myanimelistAnimes: { [key: string]: MyAnimeListAnime } = {};
const myanimelistDiscussions: { [key: string]: Discussion } = {};
const myanimelistComments: { [key: string]: Comment } = {};

const stripmsg = (c: string) => {
  if (!c?.split) return "";
  return (
    c
      ?.split("forum_boardrow1")?.[1]
      ?.split('id="messageEditWaiting')?.[0]
      ?.replace(/(<([^>]+)>)/gi, "")
      ?.replace(/\n/g, "")
      ?.replace(/\t/g, "")
      ?.replace(/\r/g, "")
      ?.replace(/&#13;/g, "")
      ?.split(">")?.[1]
      ?.split("<")?.[0] ?? ""
  );
};

const getCommentOriginalId = (c: string) => {
  try {
    return c.match(/id=\"message([^"]+)/g)?.[0]?.replace(/\D/g, "");
  } catch (e) {
    return null;
  }
};

const formatDiscussion = (
  raw: MyAnimeListRawDiscussion
): MyAnimeListDiscussion => {
  if (raw?.split) {
    const [id, partialUrl, title] = raw.split("\t");
    return {
      id,
      partialUrl,
      title,
    };
  } else {
    return {
      id: "",
      partialUrl: "",
      title: "",
    };
  }
};

const getAnimes = () => {
  [
    "lista_animes-20180624que.txt",
    "lista_animes-20181030.txt",
    "lista_animes-20190211.txt",
    "lista_animes-20190214.txt",
    "lista_animes.txt",
  ]
    .reduce(
      (acc, file) => [
        ...acc,
        ...fs
          .readFileSync(
            "D://workfolder//tcc//__original_databases//myanimelist//" + file,
            "utf8"
          )
          .split("\n"),
      ],
      [] as string[]
    )
    .forEach((plot) => {
      if (plot?.split) {
        const [id, url, animeTitle] = plot.split("\t");
        myanimelistAnimes[id] = {
          id,
          url,
          animeTitle,
        };
      }
    });
};

export const myanimelistDiscussionParser = (
  rawEntry: MyAnimeListRawDiscussion
): Discussion | undefined => {
  const entry = formatDiscussion(rawEntry);
  if (entry.id && !myanimelistDiscussions.hasOwnProperty(entry.id)) {
    const id = uuid();
    const discussion: Discussion = {
      id,
      system: "MYANIMELIST",
      label: entry.title,
      description: null,
      extra: {
        originalId: entry.id?.toString(),
        partialUrl: entry.partialUrl,
      },
    };
    myanimelistDiscussions[entry.id] = discussion;
    return discussion;
  }
};

export const myanimelistCommentsParser = (
  entry: MyAnimeListComment
): Comment | undefined => {
  const originalId = getCommentOriginalId(entry.c);
  if (originalId && !myanimelistComments.hasOwnProperty(originalId)) {
    const id = uuid();
    const discussionId = myanimelistDiscussions[entry.tID]?.id;
    if (Object.keys(myanimelistAnimes).length === 0) {
      getAnimes();
    }
    const { url, animeTitle } = myanimelistAnimes[entry.aID] ?? {
      url: "",
      animeTitle: "",
    };
    const partialUrl =
      myanimelistDiscussions[entry.tID]?.extra?.partialUrl ?? "";

    const comment: Comment = {
      id,
      system: "MYANIMELIST",
      discussionId: discussionId ?? entry.tID,
      date: null,
      content: stripmsg(entry.c),
      extra: {
        animeTitle,
        originalId: originalId?.toString(),
        url: `${url}${partialUrl.replace("/", "")}`,
      },
    };
    myanimelistComments[originalId] = comment;
    return comment;
  }
};
