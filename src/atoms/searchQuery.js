import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();
export const searchQueryState = atom({
  key: "searchQueryState",
  default: {
    location: "",
    tags: [],
    budget: [],
    localities: [],
    furnishing: [],
  },
  effects_UNSTABLE: [persistAtom],
});
