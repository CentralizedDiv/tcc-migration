import { Parser, Discussion, Comment } from "../../types";
import { getDiscussions } from "../../utils";
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

let _discussions: Discussion[] | undefined = undefined;

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
      originalId: entry.vID,
      WikiUrl: JSON.stringify(entry.WikiUrl),
    },
  };
  return discussion;
};

export const youtubeCommentsParser: Parser<Comment, YoutubeComment> = (
  entry
) => {
  const id = uuid();

  const discussions = _discussions ?? getDiscussions();
  if (!_discussions) {
    _discussions = discussions;
  }

  const discussionId = discussions.find(
    (discussion: Discussion) => discussion.extra?.originalId === entry.vID
  )?.id;

  const comment: Comment = {
    id,
    system: "YOUTUBE",
    discussionId: discussionId ?? entry.vID,
    date: null,
    content: entry.c ?? "",
    extra: {
      user: entry.author,
      originalId: entry.cID,
    },
  };
  return comment;
};
