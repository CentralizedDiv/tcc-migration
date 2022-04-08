import { Parser, Discussion, Comment } from "../../types";
import { v4 as uuid } from "uuid";

interface YoutubeComment {
  author: string;
  c: string;
  vID: string;
  cID: string;
}

interface YoutubeDiscussion {
  vID: string;
  WikiUrl: string[];
}

let discussions: { [key: string]: Discussion } = {};

export const youtubeDiscussionParser: Parser<Discussion, YoutubeDiscussion> = (
  entry
) => {
  const id = uuid();

  const discussion: Discussion = {
    id,
    system: "YOUTUBE",
    label: null,
    description: null,
    extra: {
      originalId: entry.vID?.toString(),
      WikiUrl: JSON.stringify(entry.WikiUrl),
    },
  };
  discussions[entry.vID?.toString()] = discussion;
  return discussion;
};

export const youtubeCommentsParser: Parser<Comment, YoutubeComment> = (
  entry
) => {
  const id = uuid();
  const discussionId = discussions[entry.vID?.toString()]?.id;

  const comment: Comment = {
    id,
    system: "YOUTUBE",
    discussionId: discussionId ?? entry.vID,
    date: null,
    content: entry.c ?? "",
    extra: {
      user: entry.author,
      originalId: entry.cID?.toString(),
    },
  };
  return comment;
};
