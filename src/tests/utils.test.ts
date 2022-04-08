const JSONStream = require("JSONStream");
import * as fs from "fs";
import { Readable, Writable } from "stream";
import { loopAndParse } from "../utils";

jest.mock("fs");

describe("Utils", () => {
  beforeAll(() => {
    jest.spyOn(fs, "statSync").mockImplementation(() => ({ size: 0 } as any));
  });

  afterAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test("loopAndParse", async () => {
    const stream = Readable.from([
      '{"system": "Test", "content":"Bla"}\n{"system": "Test2", "content":"Bla"}',
    ]);
    const wStream = new Writable({
      write: jest.fn(),
    });
    wStream._write = jest.fn();
    jest
      .spyOn(fs, "createReadStream")
      .mockReturnValueOnce(stream as unknown as fs.ReadStream);
    jest
      .spyOn(fs, "createWriteStream")
      .mockReturnValueOnce(wStream as unknown as fs.WriteStream);

    const transformer = JSONStream.stringify("[", ",\n", "]");
    const tStream = jest.spyOn(transformer, "write");
    jest.spyOn(JSONStream, "stringify").mockReturnValueOnce(transformer);

    await loopAndParse(["PATH"], "path.parsed.json", (original) => ({
      parsedSystem: original.system,
    }));

    expect(tStream).toHaveBeenCalledTimes(2);
    expect(tStream).toHaveBeenCalledWith({ parsedSystem: "Test" });
    expect(tStream).toHaveBeenCalledWith({ parsedSystem: "Test2" });
  });
});
