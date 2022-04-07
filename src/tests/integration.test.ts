import * as fs from "fs";

const baseFilter =
  <T extends { extra?: { [key: string]: string }; system: string }>(
    id: string,
    system: string
  ) =>
  (entity: T) =>
    entity.extra?.originalId === id && entity.system === system;

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

// describe("goodreads", () => {
//   test("Discussion", () => {
//     expect(discussions.filter(baseFilter("1", "GOODREADS"))).toHaveLength(1);
//   });
//   test("Comment", () => {
//     expect(comments.filter(baseFilter("6760426", "GOODREADS"))).toHaveLength(1);
//   });
// });

// describe("movietalk", () => {
//   test("Discussion", () => {
//     expect(discussions.filter(baseFilter("620797", "MOVIETALK"))).toHaveLength(
//       1
//     );
//   });
//   test("Comment", () => {
//     expect(comments.filter(baseFilter("11525601", "MOVIETALK"))).toHaveLength(
//       1
//     );
//   });
// });

describe("myanimelist", () => {
  test("Discussion", () => {
    const discussions = JSON.parse(
      fs.readFileSync(
        "D://workfolder//tcc//__unified_database//myanimelist.discussions.json",
        "utf8"
      )
    );
    expect(
      discussions.filter(baseFilter("1599354", "MYANIMELIST"))
    ).toHaveLength(1);
  });
  test("Comment", () => {
    const comments = JSON.parse(
      fs.readFileSync(
        "D://workfolder//tcc//__unified_database//myanimelist.comments.json",
        "utf8"
      )
    );
    expect(comments.filter(baseFilter("40287509", "MYANIMELIST"))).toHaveLength(
      1
    );
  });
});
