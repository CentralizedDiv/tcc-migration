import { Comment, Discussion, Parser } from "../../types";
import { v4 as uuid } from "uuid";
import * as fs from "fs";
interface MovieTalkDiscussion {
  id: string;
  url: string;
  title: string;
}

interface IMDBMovie {
  tID: string;
  synopsis: string;
  summaries: string[];
}

interface MovieTalkComment {
  c: string;
  tID: string;
}

const stripmsg = (originalMsg: string): string => {
  try {
    originalMsg
      .split("<!-- message -->")[1]
      .split("message -->")[0]
      .split("\x3C!-- google_ad_section_start -->")[1]
      .split("google_ad_section_start -->")[0]
      .split("\x3C!")[0]
      .replace(/(<([^>]+)>)/gi, "")
      .replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/&#13;/g, "");
  } catch (e) {
    return originalMsg;
  }
};
const getIMDBMovieInfo = (id: string): [string, string] => {
  try {
    const content = fs.readFileSync(
      "D://workfolder//tcc//__original_databases//movietalk//movies_imdb.json",
      "utf8"
    );
    const infos: IMDBMovie[] = JSON.parse(content);
    const movie = infos.find((info) => info.tID === id);
    return [movie?.synopsis ?? null, JSON.stringify(movie?.summaries) ?? null];
  } catch (e) {
    return [null, null];
  }
};
const getCommentOriginalId = (comment: string): string | null => {
  try {
    const matches = comment.match(/(td_post_|post)([^"]+)/);
    if (matches) {
      const id = matches.pop();
      if (id) return id;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const movietalkDiscussions: { [key: string]: Discussion } = {};
const movietalkComments: { [key: string]: Comment } = {};

export const movietalkDiscussionParser: Parser<
  Discussion,
  MovieTalkDiscussion
> = (entry): Discussion | undefined => {
  if (!movietalkDiscussions.hasOwnProperty(entry.id)) {
    const id = uuid();
    const [description, summaries] = getIMDBMovieInfo(entry.id);
    const discussion: Discussion = {
      id,
      system: "MOVIETALK",
      label: entry.title,
      description,
      extra: {
        originalId: entry.id?.toString(),
        url: entry.url,
        summaries,
      },
    };
    movietalkDiscussions[entry.id] = discussion;
    return discussion;
  }
};

export const movietalkCommentsParser: Parser<Comment, MovieTalkComment> = (
  entry
): Comment | undefined => {
  const originalId = getCommentOriginalId(entry.c);
  if (originalId && !movietalkComments.hasOwnProperty(originalId)) {
    const id = uuid();
    const discussionId = movietalkDiscussions[entry.tID].id;

    const comment: Comment = {
      id,
      system: "MOVIETALK",
      discussionId: discussionId ?? entry.tID,
      date: null,
      content: stripmsg(entry.c),
      extra: {
        originalId: originalId?.toString(),
      },
    };
    movietalkComments[originalId] = comment;
    return comment;
  }
};
