import createHandler from "@/middleware";
import Property from "models/Property";

const handler = createHandler();

export function capitalize(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}

handler.get(async (req, result) => {
  const searchQuery = JSON.parse(req.query.query);
  let match;
  if (searchQuery.localities.length > 0 && searchQuery.tags.length > 0) {
    if (searchQuery.furnishing.length > 0) {
      match = {
        city: capitalize(searchQuery.location.toLowerCase()),
        $and: [
          {
            tags: {
              $in: searchQuery.tags,
            },
          },
          {
            furnishing: {
              $in: searchQuery.furnishing,
            },
          },
          {
            colony: {
              $in: searchQuery.localities,
            },
          },
        ],
      };
    } else {
      match = {
        city: capitalize(searchQuery.location.toLowerCase()),
        $and: [
          {
            tags: {
              $in: searchQuery.tags,
            },
          },
          {
            colony: {
              $in: searchQuery.localities,
            },
          },
        ],
      };
    }
  } else if (searchQuery.localities.length > 0) {
    if (searchQuery.furnishing.length > 0) {
      match = {
        city: capitalize(searchQuery.location.toLowerCase()),
        $and: [
          {
            furnishing: {
              $in: searchQuery.furnishing,
            },
          },
          {
            colony: {
              $in: searchQuery.localities,
            },
          },
        ],
      };
    } else {
      match = {
        city: capitalize(searchQuery.location.toLowerCase()),
        colony: {
          $in: searchQuery.localities,
        },
      };
    }
  } else if (searchQuery.tags.length > 0) {
    if (searchQuery.furnishing.length > 0) {
      match = {
        city: capitalize(searchQuery.location.toLowerCase()),
        $and: [
          {
            tags: {
              $in: searchQuery.tags,
            },
          },
          {
            furnishing: {
              $in: searchQuery.furnishing,
            },
          },
        ],
      };
    } else {
      match = {
        city: capitalize(searchQuery.location.toLowerCase()),
        tags: {
          $in: searchQuery.tags,
        },
      };
    }
  } else {
    match = {
      city: capitalize(searchQuery.location.toLowerCase()),
    };
  }

  try {
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
          colony: 1,
          overview: 1,
          bhk: 1,
          slug: 1,
          address: 1,
          city: 1,
          state: 1,
          tags: 1,
          thumbnail: 1,
          furnishing: 1,
          vendor: {
            name: 1,
          },
        },
      },
    ])

      .then((properties) =>
        result.status(200).json({ message: "Success", properties })
      )
      .catch((err) => {
        result
          .status(403)
          .json({ message: "Something went wrong", error: err });
        console.log(err);
      });
  } catch (e) {
    console.log(e);
  }
});

// handler.post(async (req, result) => {
//   Property.find({})
//     .limit(5)
//     .sort({ createdAt: "desc" })
//     .then((res) => {
//       result.status(201).json({ message: "record updated.", property: res });
//     })
//     .catch((err) =>
//       result.status(403).json({ message: "Something went wrong", error: err })
//     );
// });

export default handler;
