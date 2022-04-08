import { Comment, Discussion, Parser } from "../../types";
import { v4 as uuid } from "uuid";
import * as fs from "fs";

type GoodreadsDiscussionRaw = string;
interface GoodreadsDiscussion {
  id: string;
  title: string;
}
const formatDiscussion = (raw: GoodreadsDiscussionRaw): GoodreadsDiscussion => {
  const [id, title] = raw.split("\t");
  return {
    id,
    title,
  };
};

interface GoodreadsComment {
  dID: string;
  tID: string;
  cat: string;
  c: string;
}

interface GoodreadsPlot {
  id: string;
  url: string;
  plot: string;
  summary: string;
}

let _plots: GoodreadsPlot[] | undefined = undefined;
const discussions: { [key: string]: Discussion } = {};

const getPlots = (): GoodreadsPlot[] => {
  return fs
    .readFileSync(
      "D://workfolder//tcc//__original_databases//goodreads//plots.jsonl",
      "utf8"
    )
    .split("\n")
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

export const goodreadsDiscussionParser: Parser<
  Discussion,
  GoodreadsDiscussionRaw
> = (rawEntry) => {
  const entry = formatDiscussion(rawEntry);
  const id = uuid();
  let plot: GoodreadsPlot | null = null;
  try {
    const plots = _plots ?? getPlots();
    if (!_plots) {
      _plots = plots;
    }

    plot = plots.find((plot) => plot.id === entry.id) ?? null;
  } catch (err) {
    console.error(err);
  }

  const discussion: Discussion = {
    id,
    system: "GOODREADS",
    label: entry.title,
    description: plot?.summary ?? null,
    extra: {
      originalId: entry.id?.toString(),
      url: plot?.url ?? null,
      plot: plot?.plot ?? null,
    },
  };
  discussions[entry.id?.toString()] = discussion;
  return discussion;
};

export const goodreadsCommentsParser: Parser<Comment, GoodreadsComment> = (
  entry
) => {
  try {
    const id = uuid();
    const discussionId = discussions[entry.dID?.toString()].id;

    const comment: Comment = {
      id,
      system: "GOODREADS",
      discussionId: discussionId ?? entry.dID,
      date: null,
      content: entry.c,
      extra: {
        user: entry.cat,
        originalId: entry.tID?.toString(),
      },
    };
    return comment;
  } catch {}
};
