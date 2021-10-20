import mongoose from "mongoose";
import config from "config";
const connect = async () => {
  const uri = config.get("uri") as string;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    poolSize: parseInt(process.env.POOL_SIZE!),
};
  return await mongoose.connect(uri)
  .then(data => console.log("successfully connected with DB!"))
  .catch(err => process.exit(1))
};

export default connect;