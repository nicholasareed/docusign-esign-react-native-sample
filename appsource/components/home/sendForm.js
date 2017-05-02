
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

import { List, ListItem } from 'react-native-elements'

import { NavigationActions } from 'react-navigation'

import { Button } from 'react-native-elements'

import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'


// const loginReset = NavigationActions.reset({
//   index: 0,
//   actions: [
//     NavigationActions.navigate({ routeName: 'Login'})
//   ]
// })

export default class SendFormScreen extends React.Component {
  static navigationOptions = {
    title: 'Send Form'
  }

  constructor(props) {
    super(props);
    this.state = {
      accountId: props.navigation.state.params.accountId,
      username: 'Nick Reed',
      email: 'nick.reed@docusign.com'
    }
    this.handlePress = this.handlePress.bind(this);
  }

  componentDidMount(){
    // alert(this.props.navigation.state.params.accountId);
  }

  handlePress(){

    this.props.navigation.dispatch( NavigationActions.navigate({ routeName: 'EmbeddedSigning', params: {
      accountId: this.state.accountId
    }}) );

  }

  render() {

    return (
      <View>

        <FormLabel>Username</FormLabel>
        <FormInput onChangeText={(username) => this.setState({username})} />

        <FormLabel>Email</FormLabel>
        <FormInput onChangeText={(email) => this.setState({email})} />

        <Text></Text>

        <Button 
          title="Sign"
          onPress={this.handlePress}
        />
        

      </View>
    )
 }

}

