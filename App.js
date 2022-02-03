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
  state: state.allnews,
});
const mapDispatch = (dispatch) => ({
  loadnews: () => dispatch.model.loadnews(),
  nextpage: () => dispatch.model.nextpage(),
  prevpage: () => dispatch.model.prevpage(),
});
 connect(mapState, mapDispatch)(App);

 const Main = () => {
   return <Provider store={store}>
     <App />
   </Provider>;
 };

 export default Main;