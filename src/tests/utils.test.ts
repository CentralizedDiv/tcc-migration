import fs from "fs";
import { loopAndParse, saveContent } from "../utils";

describe("Utils", () => {
  beforeAll(() => jest.mock("fs"));

  test("loopAndParse", () => {
    jest
      .spyOn(fs, "readFileSync")
      .mockReturnValueOnce(
        '{"system": "Test", "content":"Bla"}\n{"system": "Test2", "content":"Bla"}'
      );

    expect(
      loopAndParse("PATH", (original) => ({
        parsedSystem: original.system,
      }))
    ).toStrictEqual([{ parsedSystem: "Test" }, { parsedSystem: "Test2" }]);
  });

  test("saveContent with two systems", () => {
    jest
      .spyOn(fs, "readFileSync")
      .mockReturnValue(
        '[{ "system": "Test", "content": "Bla" }, {"system": "Test2", "content": "Bla"}]'
      );
    const writeFileSync = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {});

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
    jest.fn;
    const writeFileSync = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {});

    saveContent("PATH", "Test", [{ system: "Test", content: "BlaBla" }]);
    expect(writeFileSync).toHaveBeenCalledWith(
      "PATH",
      JSON.stringify([
        { system: "Test2", content: "Bla" },
        { system: "Test3", content: "Bla" },
        { system: "Test", content: "BlaBla" },
      ])
    );
  });
});
