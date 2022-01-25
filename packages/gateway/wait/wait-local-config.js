const waitOn = require("wait-on");

const opts = {
  resources: ["tcp:4001", "tcp:4002"],
};

const start = async () => {
  console.log("< START >");
  // Usage with async await
  try {
    await waitOn(opts);
    console.log(
      "< WAIT-ON CONFIG : ALL RESOUCERS OK - STARTING APOLLO GATEWAY >"
    );
    // once here, all resources are available
  } catch (err) {
    console.warn("< WAIT-ON CONFIG : ERROR > ", err);
    process.exit(1);
  }
};

start();
