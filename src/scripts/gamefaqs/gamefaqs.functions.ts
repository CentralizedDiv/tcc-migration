import { Comment, Discussion } from "../../types";
import { v4 as uuid } from "uuid";
import * as fs from "fs";
import { isValidDate } from "../../utils";

type GameFaqsRawDiscussion = string;
type GameFaqsRawComment = {
  did: number; // Game Id
  tid: number; // Discussion Id
  cid: number; // Comment Id
  ts: number; // Timestamp seconds
  c: string; // Content
};

const games: { [key: string]: string } = {};
const discussions: { [key: string]: string } = {};

let gamesLoaded = false;

const loadGames = () => {
  fs.readFileSync(
    "D://workfolder//tcc//__original_databases//gamefaqs//lista_jogos.txt",
    "utf8"
  )
    .split("\n")
    .map((game) => {
      const [id, , gameTitle] = game.split("\t");
      games[id] = gameTitle as string;
    });
  gamesLoaded = true;
};

export const gamefaqsDiscussionParser = (
  rawEntry: GameFaqsRawDiscussion
): Discussion => {
  if (!gamesLoaded) {
    loadGames();
  }
  const [originalId, partialUrl, label] = rawEntry.split("\t");

  let game = null;
  if (partialUrl) {
    const [, , gameUrl] = partialUrl.split("/");
    if (gameUrl) {
      const gameId = gameUrl.split("-")?.[0] ?? null;
      if (gameId) {
        game = games[gameId];
      }
    }
  }

  const id = uuid();
  const discussion: Discussion = {
    id,
    system: "GAMEFAQS",
    label,
    description: null,
    extra: {
      originalId: originalId?.toString(),
      game,
      partialUrl,
    },
  };
  discussions[originalId] = id;
  return discussion;
};

export const gamefaqsCommentsParser = (entry: GameFaqsRawComment): Comment => {
  const originalId = entry.cid;
  const id = uuid();
  const discussionId = discussions[entry.tid];
  const date = new Date(entry.ts * 1000);
  const comment: Comment = {
    id,
    system: "GAMEFAQS",
    discussionId: discussionId ?? entry.tid,
    date: isValidDate(date) ? date.toISOString() : null,
    content: entry.c,
    extra: {
      game: games[entry.did],
      originalId: originalId?.toString(),
    },
  };
  return comment;
};
