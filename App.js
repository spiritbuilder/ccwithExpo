import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import Landing from "./screens/Landing";

import NewsItem from "./components/NewsItem";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import News from "./screens/News";
import AddNews from "./screens/AddNews";
import { Provider,connect } from "react-redux";
import "redux";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import store from "./store/start";
const Stack = createNativeStackNavigator();
const {dispatch} = store
const App = () => {
  return (
    
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{
            headerStyle: {
              backgroundColor: "rgba(26, 137, 23, 1)",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="Landing"
            component={Landing}
            options={{ title: "Latest News" }}
          />
          <Stack.Screen name="News" component={News} />
          <Stack.Screen name="AddNews" component={AddNews} />
        </Stack.Navigator>
      </NavigationContainer>
   
  );
};






const mapState = (state) => ({
  news: state.news
});
const mapDispatch = (dispatch) => ({
  loadnews: () => dispatch.news.loadnews(),
  nextpage: () => dispatch.news.nextpage(),
  prevpage: () => dispatch.news.prevpage(),
});
let Connected =  connect(mapState, mapDispatch)(App);

 const Main = () => {
   return (
     <Provider store={store}>
       <Connected />
      
     </Provider>
   );
 };

 export default Main;