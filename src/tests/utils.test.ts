import * as fs from "fs";
import { Readable } from "stream";
import { loopAndParse, saveContent } from "../utils";

jest.mock("fs");

describe("Utils", () => {
  let writeFileSync;

  beforeAll(() => {
    writeFileSync = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test("Default", () => expect(true).toBeTruthy());

  /* test("loopAndParse", async () => {
    const stream = Readable.from([
      '{"system": "Test", "content":"Bla"}\n{"system": "Test2", "content":"Bla"}',
    ]);

    jest
      .spyOn(fs, "createReadStream")
      .mockReturnValueOnce(stream as unknown as fs.ReadStream);

    expect(
      await loopAndParse("PATH", (original) => ({
        parsedSystem: original.system,
      }))
    ).toStrictEqual([{ parsedSystem: "Test" }, { parsedSystem: "Test2" }]);
  });

  test("saveContent with two systems", () => {
    jest
      .spyOn(fs, "readFileSync")
      .mockReturnValueOnce(
        '[{ "system": "Test", "content": "Bla" }, {"system": "Test2", "content": "Bla"}]'
      );

    saveContent("PATH", "Test", [{ system: "Test", content: "BlaBla" }]);
    expect(writeFileSync).toHaveBeenCalledWith(
      "PATH",
      JSON.stringify([
        { system: "Test2", content: "Bla" },
        { system: "Test", content: "BlaBla" },
      ])
    );
  });

  test("saveContent with more systens", () => {
    jest
      .spyOn(fs, "readFileSync")
      .mockReturnValueOnce(
        '[{ "system": "Test", "content": "Bla" }, { "system": "Test", "content": "Bla" }, { "system": "Test2", "content": "Bla" }, { "system": "Test3", "content": "Bla" }]'
      );

    saveContent("PATH", "Test", [{ system: "Test", content: "BlaBla" }]);
    expect(writeFileSync).toHaveBeenCalledWith(
      "PATH",
      JSON.stringify([
        { system: "Test2", content: "Bla" },
        { system: "Test3", content: "Bla" },
        { system: "Test", content: "BlaBla" },
      ])
    );
  }); */
});
