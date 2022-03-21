import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();
export const comparePropertyState = atom({
  key: "comparePropertyState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
