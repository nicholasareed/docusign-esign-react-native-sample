
import React, { Component } from 'react';
import {
  ActionSheetIOS,
  StyleSheet,
  Text,
  Switch,
  Image,
  View,
} from 'react-native';

import AuthActions from '../../actions/AuthActions'
import AuthStore from '../../stores/AuthStore'

import Reflux from 'reflux';

import Icon from 'react-native-vector-icons/FontAwesome';

import { NavigationActions } from 'react-navigation'

const loginReset = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Login'})
  ]
})

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
    tabBar: {
      icon: () => (
        <Icon name="cogs" size={30} color="#211630" />
      )
    }
  }

  constructor(props) {
    super(props);
    this.state = {}
    // this.store = AuthStore;

  }

  componentDidMount(){

    // this.unsubscribe = AuthStore.listen(this._onAuthChange);

  }
  componentWillUnmount() {
    // this.unsubscribe();
  }

  _onAuthChange = (authDetails) => {
    console.log('--Auth change--');
    console.log('authDetails', authDetails);



    // this.setState(authDetails, () => {

    //   if(this.state.loggedIn){
    //     console.log('LOGGED IN!');
    //     console.log('PAGEPAGEPAGE should change');


    //     // this.props.navigator.replace(global.Router.getRoute('home'));
    //     // this.props.navigation.navigate('Home', {});
    //     self.props.navigation.dispatch(homeReset);

    //     // var redirectUrl = this.getQuery().redirect || '/';
    //     // this.replaceWith(redirectUrl);
    //   } else {
    //     console.log('_onAuthChange:Failed login');
    //   }
    // });
    
  }


 _goToLogout = () => {
   // // this.props.navigator.push(Router.getRoute('login'));
   // this.props.navigator.replace(global.Router.getRoute('login'));

   console.log('Logout clicked');
    // AuthActions.logout();

    // this.props.navigation.dispatch(loginReset);
    this.props.navigation.navigate('Login', {});

 }

  render() {
   return (
     <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
       <Text>Settings</Text>

       <Text onPress={this._goToLogout} style={{padding: 10, 'borderWidth': 1, borderColor: '#ccc'}}>
         Logout
       </Text>

     </View>
   )
 }

}

