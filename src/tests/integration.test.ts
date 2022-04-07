import * as fs from "fs";
import * as es from "event-stream";

const searchOnFile = (path: string, id: string, system: string) => {
  return new Promise<boolean>((resolve) => {
    const stream = fs
      .createReadStream(path, "utf8")
      .pipe(es.split("\n"))
      .pipe(
        es.mapSync((original: any) => {
          try {
            const row = JSON.parse(original.replace(/\[|\]|,\s*$/g, ""));
            if (row.extra.originalId === id && row.system === system) {
              resolve(true);
              stream.destroy();
              return;
            }
          } catch {
            resolve(false);
          }
        })
      );
  });
};
describe("Integration", () => {
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
    test("Discussion", async () => {
      const found = await searchOnFile(
        "D://workfolder//tcc//__unified_database//myanimelist.discussions.json",
        "1599354",
        "MYANIMELIST"
      );
      expect(found).toBeTruthy();
    });

    test("Comment", async () => {
      const found = await searchOnFile(
        "D://workfolder//tcc//__unified_database//myanimelist.comments.json",
        "40287509",
        "MYANIMELIST"
      );
      expect(found).toBeTruthy();
    });
  });

  describe("gamefaqs", () => {
    /* test("Discussion", async () => {
      const found = await searchOnFile(
        "D://workfolder//tcc//__unified_database//gamefaqs.discussions.json",
        "73000753",
        "GAMEFAQS"
      );
      expect(found).toBeTruthy();
    });

    test("Comment", async () => {
      const found = await searchOnFile(
        "D://workfolder//tcc//__unified_database//gamefaqs.comments.json",
        "876738991",
        "GAMEFAQS"
      );
      expect(found).toBeTruthy();
    }); */
  });
});
