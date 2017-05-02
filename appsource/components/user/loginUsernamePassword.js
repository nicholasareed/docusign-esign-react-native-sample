
import React, { Component } from 'react';
import {
  ActionSheetIOS,
  StyleSheet,
  Text,
  TextInput,
  Switch,
  Image,
  View,
} from 'react-native';

var _ = require('lodash');

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

export default class loginUsernamePassword extends React.Component {
  static navigationOptions = {
    title: 'Login'
  }

  constructor(props) {
    super(props);
    this.state = {
      // accountId: props.navigation.state.params.accountId,
      username: __config.username,
      password: __config.password,
      trying: false
    }
    this.handlePress = this.handlePress.bind(this);
  }

  componentDidMount(){
    // alert(this.props.navigation.state.params.accountId);
  }

  handlePress(){

    // Custom HTTP Header Authentication (do NOT use this in production, because it is all in-the-clear [Integrator Keys should be secret]!)

    // initialize the api client
    var apiClient = new docusign.ApiClient();
    apiClient.setBasePath(__config.esign_api_host);

    // create JSON formatted auth header
    var creds = JSON.stringify({
      Username: this.state.username,
      Password: this.state.password,
      IntegratorKey: __config.internal_client_id
    });
    apiClient.addDefaultHeader('X-DocuSign-Authentication', creds);

    // assign api client to the Configuration object
    docusign.Configuration.default.setDefaultApiClient(apiClient);

    // login call available off the AuthenticationApi
    var authApi = new docusign.AuthenticationApi();

    // login has some optional parameters we can set
    var loginOps = {};
    loginOps.apiPassword = 'true';
    loginOps.includeAccountIdGuid = 'true';


    this.setState({
      trying: true
    });
    // alert(typeof DSBridge);
    // return;


    authApi.login(loginOps, (err, loginInfo, response) => {

      this.setState({
        trying: false
      });

      if (err) {
        alert(err);
        return;
      }

      if (loginInfo) {
        // list of user account(s)
        // note that a given user may be a member of multiple accounts
        var loginAccounts = loginInfo.loginAccounts;
        console.log('LoginInformation: ' + JSON.stringify(loginAccounts));
        var loginAccount = loginAccounts[0];
        var accountId = loginAccount.accountId;
        var baseUrl = loginAccount.baseUrl;
        var accountDomain = baseUrl.split("/v2");

        // below code required for production, no effect in demo (same domain)
        apiClient.setBasePath(accountDomain[0]);
        docusign.Configuration.default.setDefaultApiClient(apiClient);

        // alert(JSON.stringify(loginAccount));

        this.props.navigation.dispatch( homeReset ); //NavigationActions.navigate({ routeName: 'Accounts'}) );

      }
    });

  }

  render() {

    return (
      <View>

        <FormLabel>Username</FormLabel>
        <FormInput value={this.state.username} onChangeText={(username) => this.setState({username})} />

        <FormLabel>Password</FormLabel>
        <FormInput value={this.state.password} onChangeText={(password) => this.setState({password})} secureTextEntry={true} />

        <Text></Text>

        <Button 
          title={this.state.trying ? "Signing In":"Sign In"}
          onPress={this.handlePress}
        />
        

      </View>
    )
 }

}

