const mongoose = require("mongoose");
const uri =
  "mongodb+srv://mirzaikram129:Jabir%23%2412@fixkaput.ai3gi.mongodb.net/mydatabase?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
