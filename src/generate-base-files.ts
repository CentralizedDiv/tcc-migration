import * as fs from "fs";
fs.writeFileSync(
  __dirname + "/../__unified_database/comments.json",
  JSON.stringify([]),
  {
    flag: "w",
  }
);
fs.writeFileSync(
  __dirname + "/../__unified_database/discussions.json",
  JSON.stringify([]),
  {
    flag: "w",
  }
);
fs.writeFileSync(
  __dirname + "/../__unified_database/systems.json",
  JSON.stringify([]),
  {
    flag: "w",
  }
);
