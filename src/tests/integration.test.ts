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
  describe("Reddit", () => {
    test("Discussion", async () => {
      const found = await searchOnFile(
        "D://workfolder//tcc//__unified_database//reddit.discussions.json",
        "1nvo5z",
        "REDDIT"
      );
      expect(found).toBeTruthy();
    });
    test("Comment", async () => {
      const found = await searchOnFile(
        "D://workfolder//tcc//__unified_database//reddit.comments.json",
        "ccah352",
        "REDDIT"
      );
      expect(found).toBeTruthy();
    });
  });

  describe("Youtube", () => {
    test("Discussion", async () => {
      const found = await searchOnFile(
        "D://workfolder//tcc//__unified_database//youtube.discussions.json",
        "ORqLy6ANNbk",
        "YOUTUBE"
      );
      expect(found).toBeTruthy();
    });
    test("Comment", async () => {
      const found = await searchOnFile(
        "D://workfolder//tcc//__unified_database//youtube.comments.json",
        "Ugge3mUBme2mm3gCoAEC",
        "YOUTUBE"
      );
      expect(found).toBeTruthy();
    });
  });

  describe("goodreads", () => {
    test("Discussion", async () => {
      const found = await searchOnFile(
        "D://workfolder//tcc//__unified_database//goodreads.discussions.json",
        "1",
        "GOODREADS"
      );
    });
    test("Comment", async () => {
      const found = await searchOnFile(
        "D://workfolder//tcc//__unified_database//goodreads.comments.json",
        "6760426",
        "GOODREADS"
      );
      expect(found).toBeTruthy();
    });
  });

  describe("movietalk", () => {
    test("Discussion", async () => {
      const found = await searchOnFile(
        "D://workfolder//tcc//__unified_database//movietalk.discussions.json",
        "620797",
        "MOVIETALK"
      );
      expect(found).toBeTruthy();
    });
    test("Comment", async () => {
      const found = await searchOnFile(
        "D://workfolder//tcc//__unified_database//movietalk.comments.json",
        "11525601",
        "MOVIETALK"
      );
      expect(found).toBeTruthy();
    });
  });

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
    test("Discussion", async () => {
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
    });
  });
});
