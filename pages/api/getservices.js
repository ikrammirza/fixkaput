import service from "../../models/Service";

import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  let services = await service.find();

  res.status(200).json({ services });
};
export default connectDb(handler);
