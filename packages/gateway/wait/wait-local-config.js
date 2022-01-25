import waitOn from "wait-on";

const opts = {
  resources: [
    "http-get://localhost:4001/dogs/graphql",
    "http-get://localhost:4002/cats/graphql",
  ],
};

waitOn(opts)
  .then(() => {
    // once here, all resources are available
    console.log("< WAIT-ON : ALL RESOUCERS OK >");
  })
  .catch((err) => {
    handleError(err);
  });

// Usage with async await
try {
  await waitOn(opts);
  // once here, all resources are available
} catch (err) {
  handleError(err);
}
