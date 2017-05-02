
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

export default class loginOAuthScreen extends React.Component {
  static navigationOptions = {
    header:{
      visible: false
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      username: __config.recipient_email,
      url: null,
      client_id: __config.oauth_client_id,
      host: __config.oauth_host,
      redirect_uri: 'https://www.docusign.com/callback',
      state: ''
    }
    this.createOAuthUrl = this.createOAuthUrl.bind(this);
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    this.onShouldStartLoadWithRequest = this.onShouldStartLoadWithRequest.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  componentDidMount(){

    var url = this.createOAuthUrl();

    this.setState({
      url: url
    });

  }

  createOAuthUrl(){

    // https://docs.docusign.com/esign/guide/authentication/oa2_implicit.html

    var state = (new Date()).getTime();
    this.setState({
      state: state
    });

    return `${this.state.host}/oauth/auth?response_type=token&scope=signature&client_id=${this.state.client_id}&state=${state}&redirect_uri=${this.state.redirect_uri}`;

  }

  onNavigationStateChange(navState){

    if(this.state.left){
      return;
    }

    var url = new URL(navState.url, true);

    if(navState.url.indexOf(this.state.redirect_uri) === 0){

      // access_token comes back behind a hash fragment, in querystring format
      // - // https://docs.docusign.com/esign/guide/authentication/oa2_implicit.html
      var tokenUrl = new URL('/?'+url.hash.substr(1), true);

      var token = tokenUrl.query.access_token;

      // var tokenConfig = {
      //   token: token,
      //   host: oauth_hostoauth_host
      // };
      // DSBridge.setApiClient(tokenConfig);


      // initialize the api client
      var apiClient = new docusign.ApiClient();
      apiClient.setBasePath(__config.esign_api_host);
      apiClient.addDefaultHeader('Authorization', 'Bearer ' + token);
      docusign.Configuration.default.setDefaultApiClient(apiClient);

      this.setState({
        left: true
      });

      this.props.navigation.dispatch( homeReset );

      // this.props.navigation.dispatch(NavigationActions.back());

      // this.getUser(tokenUrl.query.access_token);

    }

    // cancelled?
    if(navState.url.indexOf('error=user_cancelled') > -1){

      this.props.navigation.dispatch(NavigationActions.back());

    }

  }

  onShouldStartLoadWithRequest(event){
    // maybe stop some loading here?
    return true;
  }

  getUser(token){

    var tokenConfig = {
      token: token,
      host: 'https://demo.docusign.net/restapi'
    };
    DSBridge.setApiClient(tokenConfig);

    // alert('after setApiClientWithToken');

    DSBridge.AuthenticationApi.login({}, (err, result) => {
    // DSBridge.AuthenticationApi.login({}, function(err, result){
      if(err){
        alert('ERROR!');
        return;
      }

      // alert('Logged in!');
      // alert(typeof result);
      // alert('done login');
      // alert(JSON.stringify(result));
      // return;

      // Returns accounts
      // Set authentication client for future calls (updated host) 
      // Store accountId globally 

      var account = result.loginAccounts[0];
      var host = account.baseUrl.split('/v2')[0]; // remove the accountId from the baseUrl returned
      var accountId = account.accountId;
      global.accountId = accountId;

      // Get folders for this account
      // - mostly just an authentication test call
      var postAuthObj = _.clone(tokenConfig);
      postAuthObj.host = host;
      DSBridge.setApiClient(postAuthObj);


      this.props.navigation.dispatch( NavigationActions.navigate({ routeName: 'Accounts'}) );

      return;


      // DSBridge.FoldersApi.listFolders(accountId, function(err, folders){
      //   if(err){
      //     alert('Folders error!');
      //     return;
      //   }

      //   // alert('Got Folders! ' + JSON.stringify(folders));
      //   alert('Got Folders! ' + _.map(folders.folders,'name') + _.map(folders.folders,'folderId'));

      //   var folderId = _.find(folders.folders,{name:'Sent Items'}).folderId;
      //   DSBridge.foldersApi_listFolderItems(accountId, folderId, function(err, items){
      //     if(err){
      //       alert('folder items error!');
      //       return;
      //     }

      //     // // alert('Got Folders! ' + _.map(folders.folders,'name') + _.map(folders.folders,'folderId'));
      //     // alert('Got folder items:' + (typeof items));
      //     // alert(items.length);
      //     alert(JSON.stringify(items.folderItems));
          
      //   })

      // })


    });

    // this.props.navigation.dispatch( NavigationActions.navigate({ routeName: 'EmbeddedSigning', params: {
    //   accountId: this.state.accountId
    // }}) );

  }

  render() {

    if(this.state.url){
      return (
        <WebView
          source={{uri: this.state.url}}
          style={{marginTop: 20}}
          onNavigationStateChange={this.onNavigationStateChange}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
        />
      )
    } else {
      return (<View />)
    }

 }

}

