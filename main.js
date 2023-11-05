const express = require("express");
const app = express();
const userRoutes = require("./src/routes/user");
const boardRoutes = require("./src/routes/board");

app.use(express.json());

app.use("/user", userRoutes);
app.use("/board", boardRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
