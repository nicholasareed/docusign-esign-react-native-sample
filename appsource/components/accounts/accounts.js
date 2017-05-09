
import React, { Component } from 'react';
import {
  Platform,
  ActionSheetIOS,
  StyleSheet,
  Text,
  Switch,
  Image,
  View,
} from 'react-native';

import { List, ListItem } from 'react-native-elements'

import { NavigationActions } from 'react-navigation'


export default class AccountsScreen extends React.Component {
  static navigationOptions = {
    title: 'Accounts'
  }

  constructor(props) {
    super(props);
    this.state = {
      accounts: []
    }
    this.handlePress = this.handlePress.bind(this);

  }

  componentDidMount(){

    // Run login_information to get accounts

    // login call available off the AuthenticationApi
    var authApi = new docusign.AuthenticationApi();

    // login has some optional parameters we can set
    var loginOps = {};
    loginOps.api_password = 'true';
    loginOps.include_account_id_guid = 'true';


    this.setState({
      trying: true
    });

    authApi.login(loginOps, (err, loginInfo, response) => {
      if(err){
        alert('ERROR! ' + JSON.stringify(response.status));
        return;
      }

      this.setState({
        accounts: loginInfo.loginAccounts
      });

    });
  }

  handlePress(account, i, event){
        
    // Update apiClient for subsequent calls 
    // - required for live/production! 

    var accountId = account.accountId;
    var baseUrl = account.baseUrl;
    var accountDomain = baseUrl.split("/v2");

    var apiClient = docusign.Configuration.default.getDefaultApiClient();
    apiClient.setBasePath(__config.esign_api_host);


    this.props.navigation.dispatch( NavigationActions.navigate({ routeName: 'Home', params: {
      account: account
    }}) );

  }

  render() {
    var self = this;

    return (
      <View>
        <List>
          {
            this.state.accounts.map((item, i) => (
              <ListItem
                key={i}
                onPress={(event) => self.handlePress(item,i,event)}
                title={item.name}
                subtitle={`${item.userName}: (${item.email})`}
                leftIcon={(item.isDefault == 'true') ? {
                  name: 'star'
                }:{
                  name: 'star-border'
                }}
                value={i}
              />
            ))
          }
        </List>
      </View>
    )
 }

}

