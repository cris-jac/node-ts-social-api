import mongoose from "mongoose";
import logger from "./logger";

const connect = async () => {
  const dbUri = process.env.DB_URI || "";

  //   return mongoose
  //     .connect(dbUri)
  //     .then(() => {
  //       console.log("Connected to DB");
  //     })
  //     .catch(() => {
  //       console.log("Could not connect to DB");
  //     });
  try {
    await mongoose.connect(dbUri);
    logger.info("Connected to DB");
  } catch (e) {
    logger.error("Could not connect to DB");
  }
};

export default connect;
