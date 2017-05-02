
import React, { Component } from 'react';
import {
  ActionSheetIOS,
  StyleSheet,
  Text,
  Switch,
  Image,
  View,
} from 'react-native';



import { NavigationActions } from 'react-navigation'

const homeReset = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Home'})
  ]
})

const loginReset = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Login'})
  ]
})


export default class InitScreen extends React.Component {

  static navigationOptions = {
    header:{
      visible: false
    }
  }

  componentWillMount(){
    var self = this;
    console.log(self.props);
    global.storage.get('userid')
    .then(function(userid){
      console.log('=-=-=-=- userid:', userid);
      if(userid){
        // self.props.navigator.replace(global.Router.getRoute('home'));
        // self.props.navigation.navigate('Home', {})

        self.props.navigation.dispatch(homeReset);
      } else {
        // self.props.navigator.replace(global.Router.getRoute('login'));
        // self.props.navigation.navigate('Login', {})
        self.props.navigation.dispatch(loginReset);
      }
    });

  }

  render() {
   return (
     <View></View>
   )
 }
}
