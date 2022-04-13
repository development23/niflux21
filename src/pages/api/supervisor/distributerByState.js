import createHandler from "@/middleware";
import Distributer from "models/Distributer";

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
  // console.log(req.query);
  await Distributer.find({
    state: req.query.state,
    $or: [
      { name: { $regex: req.query.name.toLowerCase() } },
      { city: { $regex: capitalize(req.query.name.toLowerCase()) } },
    ],
  })
    .sort({ name: 1 })
    .then((res) => {
      // console.log(res);
      result.status(201).json({ message: "Success.", distributer: res });
    })
    .catch((err) => {
      console.log(err),
        result.status(403).json({ message: "Something went wrong", err });
    });
});

export default handler;
