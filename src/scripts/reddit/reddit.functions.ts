import { Comment, Discussion, Parser } from "../../types";
import { v4 as uuid } from "uuid";
import * as fs from "fs";
import { getDiscussions } from "../../utils";

interface RedditDiscussion {
  dID: string;
  url: string;
  title: string;
}

interface RedditComment {
  cID: string;
  dID: string;
  tID: string;
  c: string;
  user: string;
  submission_date: string;
  upvotes: string;
  downvotes: string;
}

interface RedditPlot {
  dID: string;
  plot: string;
}

let _plots: RedditPlot[] | undefined = undefined;
let _discussions: Discussion[] | undefined = undefined;

const getPlots = (): RedditPlot[] => {
  return ["comedy_plots.jsonl", "drama.jsonl", "medical_plots.jsonl"]
    .reduce(
      (acc, file) => [
        ...acc,
        ...fs
          .readFileSync(
            "D://workfolder//tcc//__original_databases//reddit//plots//" + file,
            "utf8"
          )
          .split("\n"),
      ],
      [] as string[]
    )
    .map((plot) => {
      if (typeof plot === "string") {
        try {
          return JSON.parse(plot);
        } catch (err) {
          return plot;
        }
      }
      return plot;
    });
};

export const redditDiscussionParser: Parser<Discussion, RedditDiscussion> = (
  entry
) => {
  const id = uuid();
  let description = null;
  try {
    const plots = _plots ?? getPlots();
    if (!_plots) {
      _plots = plots;
    }

    description =
      plots.find((plot) => plot.dID === entry.dID)?.plot.trim() ?? null;
  } catch (err) {
    console.error(err);
  }

  const discussion: Discussion = {
    id,
    system: "REDDIT",
    label: entry.title,
    description,
    extra: {
      originalId: entry.dID?.toString(),
      url: entry.url,
    },
  };
  return discussion;
};

export const redditCommentsParser: Parser<Comment, RedditComment> = (entry) => {
  const id = uuid();

  const discussions = _discussions ?? getDiscussions();
  if (!_discussions) {
    _discussions = discussions;
  }

  const discussionId = discussions.find(
    (discussion: Discussion) => discussion.extra?.originalId === entry.dID
  )?.id;

  const comment: Comment = {
    id,
    system: "REDDIT",
    discussionId: discussionId ?? entry.dID,
    date: entry.submission_date,
    content:
      entry.c?.match(/<p>(.*?)<\/p>/g)?.map(function (val) {
        return val.replace(/<\/?p>/g, "");
      })[0] ?? "",
    extra: {
      user: entry.user,
      originalId: entry.cID?.toString(),
      threadId: entry.tID,
      upvotes: entry.upvotes,
      downvotes: entry.downvotes,
    },
  };
  return comment;
};
