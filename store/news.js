import Toast from "react-native-toast-message";
import baseUrl from "../utils/helpers";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

const handleException = (x, description) => {
  Toast.show({
    type: "info",
    text1: description,
  });
  return x;
};

const news = {
  state: {
    allnews: [],
    currentpage: 0,
    pageNews: [],
        maxpages: 0,
    
  },
  reducers: {
      loadnews: (state, payload) => {
        
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
            : state.currentpage,
          pageNews: state.currentpage<state.maxpages?state.allnews.slice(10*(state.currentpage),10*(state.currentpage+1)):state.pageNews,
      };
    },
    prevpage: (state, payload) => {
      return {
        ...state,
        currentpage:
          state.currentpage > 1
            ? state.currentpage - 1
            : state.currentpage,
        pageNews: 
          state.currentpage >1
            ? state.allnews.slice(
                10 *( state.currentpage-2),
                10 * (state.currentpage-1)
              )
            : state.pageNews
      
      };
    },
  },

  effects: (dispatch) => ({
    async fetchnews() {},
  }),
};

export default news;
