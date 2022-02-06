import { Comment, Discussion } from "../types";
import { getComments, getDiscussions } from "../utils";

let discussions: Discussion[];
let comments: Comment[];

const baseFilter =
  <T extends { extra?: { [key: string]: string }; system: string }>(
    id: string,
    system: string
  ) =>
  (entity: T) =>
    entity.extra?.originalId === id && entity.system === system;

beforeAll(() => {
  discussions = getDiscussions();
  comments = getComments();
});

// describe("Reddit", () => {
//   test("Discussion", () => {
//     expect(discussions.filter(baseFilter("1nvo5z", "REDDIT"))).toHaveLength(1);
//   });
//   test("Comment", () => {
//     expect(comments.filter(baseFilter("ccah352", "REDDIT"))).toHaveLength(1);
//   });
// });

// describe("Youtube", () => {
//   test("Discussion", () => {
//     expect(
//       discussions.filter(baseFilter("ORqLy6ANNbk", "YOUTUBE"))
//     ).toHaveLength(1);
//   });
//   test("Comment", () => {
//     expect(
//       comments.filter(baseFilter("Ugge3mUBme2mm3gCoAEC", "YOUTUBE"))
//     ).toHaveLength(1);
//   });
// });

describe("goodreads", () => {
  test("Discussion", () => {
    expect(discussions.filter(baseFilter("1", "GOODREADS"))).toHaveLength(1);
  });
  test("Comment", () => {
    expect(comments.filter(baseFilter("6760426", "GOODREADS"))).toHaveLength(1);
  });
});
