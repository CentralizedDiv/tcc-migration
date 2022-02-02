import fs from "fs";

fs.writeFileSync(
  __dirname + "/../__unified_database/comments.json",
  JSON.stringify({ comments: [] }),
  {
    flag: "w",
  }
);
fs.writeFileSync(
  __dirname + "/../__unified_database/discussions.json",
  JSON.stringify({ discussions: [] }),
  {
    flag: "w",
  }
);
fs.writeFileSync(
  __dirname + "/../__unified_database/systems.json",
  JSON.stringify({ systems: [] }),
  {
    flag: "w",
  }
);
