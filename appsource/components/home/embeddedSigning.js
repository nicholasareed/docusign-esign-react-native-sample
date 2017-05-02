
import React, { Component } from 'react';
import {
  ActionSheetIOS,
  StyleSheet,
  Text,
  TextInput,
  Switch,
  Image,
  View,
  WebView
} from 'react-native';

var _ = require('lodash');
var URL = require('url-parse');

import { List, ListItem } from 'react-native-elements'

import { NavigationActions } from 'react-navigation'

import { Button } from 'react-native-elements'

import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'


const homeReset = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Accounts'})
  ]
})

export default class EmbeddedSigningScreen extends React.Component {
  static navigationOptions = {
    header:{
      visible: false
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      url: props.navigation.state.params.url,
      returnUrl: props.navigation.state.params.returnUrl,
    }
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    this.onShouldStartLoadWithRequest = this.onShouldStartLoadWithRequest.bind(this);
  }

  onNavigationStateChange(navState){

    if(navState.url.indexOf(this.state.returnUrl) === 0){
      // alert('done');
      this.props.navigation.dispatch( homeReset );
    }

  }

  onShouldStartLoadWithRequest(event){
    // maybe stop some loading here?
    return true;
  }

  render() {

    return (
      <WebView
        source={{uri: this.state.url}}
        style={{marginTop: 20}}
        startInLoadingState={true}
        onNavigationStateChange={this.onNavigationStateChange}
        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
      />
    )

 }

}