import createHandler from "@/middleware";
import Property from "models/Property";
import Mongoose from "mongoose";

const handler = createHandler();

handler.post(async (req, result) => {
  const ids = req.body.propertyIds;
  const mongoIdObject = ids.map((id) => Mongoose.Types.ObjectId(id));
  try {
    const match = {
      _id: {
        $in: mongoIdObject,
      },
    };

    Property.aggregate([
      {
        $lookup: {
          from: "vendors",
          localField: "vid",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $match: match,
      },
      {
        $project: {
          name: 1,
          overview: 1,
          bhk: 1,
          slug: 1,
          address: 1,
          city: 1,
          state: 1,
          tags: 1,
          thumbnail: 1,
          type: 1,
          status: 1,
          amenities: 1,
          area: 1,
          price: 1,
          furnishing: 1,
          colony: 1,
          images: 1,
          vendor: {
            name: 1,
          },
        },
      },
    ])
      .then((properties) =>
        result.status(200).json({ message: "Success", properties })
      )
      .catch((err) =>
        result.status(403).json({ message: "Something went wrong", error: err })
      );
  } catch (e) {
    console.log(e);
  }
});

export default handler;
