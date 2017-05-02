import React, { Component } from 'react';
import {
  AppRegistry,
  NativeModules
} from 'react-native';

var base64 = require('base-64');
global.atob = base64.decode;
global.btoa = base64.encode;

require('./storage.js');

global.__config = require('../config.json');

import { StackNavigator } from 'react-navigation';


// var DocuSignBridge  = require('react-native-docusign-esign');
// global.DSBridge = global.DocuSignBridge = DocuSignBridge;


var docusign = require('docusign-esign-react-native');
global.docusign = docusign;


// Get previous info from Storage
// - todo


import InitScreen from './components/InitScreen.js';
import HomeScreen from './components/home/home.js';
import LoginScreen from './components/user/login.js';
import LoginOAuthScreen from './components/user/loginOAuth';
import LoginUsernamePasswordScreen from './components/user/loginUsernamePassword';
import AccountsScreen from './components/accounts/accounts.js';
import SendFormScreen from './components/home/sendForm.js';
import EmbeddedSigningScreen from './components/home/embeddedSigning.js';


var AppNavigator = StackNavigator({
  Init: { screen: InitScreen },
  Login: { screen: LoginScreen },
  LoginOAuth: { screen: LoginOAuthScreen },
  LoginUsernamePassword: { screen: LoginUsernamePasswordScreen },
  Home: { screen: HomeScreen },
  Accounts: { screen: AccountsScreen },
  SendForm: { screen: SendFormScreen },
  EmbeddedSigning: { screen: EmbeddedSigningScreen }
},{
  headerMode: 'screen'
});


class App extends React.Component {
  componentDidMount(){
    console.log("APP MOUNTED");
  }
  render() {
    return (
      <AppNavigator ref={nav => { this.navigator = nav; }} />
    );
  }
}

AppRegistry.registerComponent('DocuSignReactNativeSample', () => App);

