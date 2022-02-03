import Toast from "react-native-toast-message";
import baseUrl from "../utils/helpers";
import {AsyncStorage} from "@react-native-community/async-storage"

const handleException = (x, description) => {
  Toast.show({
    type: info,
    text1: description,
  });
  return x;
};

const model = {
  state: {
    allnews: [],
    currentpage: 0,
    pageNews: [],
        maxpages: 0,
    
  },
  reducers: {
      loadnews: async (state, payload) => {
        await  AsyncStorage.setItem("news", payload)
      return {
        allnews: payload,
        currentpage: 1,
        pageNews: payload.slice(0, 10),
          maxpages: Math.ceil(payload.length / 10),
       
      };
    },
    nextpage: (state, payload) => {
      return {
        ...state,
        currentpage:
          state.maxpages > state.currentpage
            ? state.currentpage + 1
            : handleException(state.currentpage, "this is the last page"),
          pageNews: state.allnews.slice(state.currentpage<state.maxpages?state.allnews.slice(10*state.currentpage,10*state.currentpage+1):state.pageNews),
      };
    },
    prevpage: (state, payload) => {
      return {
        ...state,
        currentpage:
          state.currentpage > 1
            ? state.currentpage - 1
            : handleException(state.currentpage, "this is the last page"),
        pageNews: state.allnews.slice(
          state.currentpage >1
            ? state.allnews.slice(
                10 * state.currentpage-2,
                10 * state.currentpage-1
              )
            : state.pageNews
        ),
      };
    },
  },

  effects: (dispatch) => ({
    async fetchnews() {},
  }),
};

export default model;
