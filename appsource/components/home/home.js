
import React, { Component } from 'react';
import {
  ActionSheetIOS,
  StyleSheet,
  Text,
  Switch,
  Image,
  View,
} from 'react-native';

import { List, ListItem } from 'react-native-elements'

import { NavigationActions } from 'react-navigation'

// const loginReset = NavigationActions.reset({
//   index: 0,
//   actions: [
//     NavigationActions.navigate({ routeName: 'Login'})
//   ]
// })

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
  }

  constructor(props) {
    super(props);
    this.state = {
      accountId: props.navigation.state.params.accountId
    }
    this.handlePress = this.handlePress.bind(this);
  }

  componentDidMount(){
    // alert(this.props.navigation.state.params.accountId);
  }

  handlePress(item){

    this.props.navigation.dispatch( NavigationActions.navigate({ routeName: 'SendForm', params: {
      accountId: this.state.accountId
    }}) );

  }

  render() {


    const list = [
      {
        title: 'Send Envelope from Document'
      },
      {
        title: 'Send Envelope from Template'
      },
      {
        title: 'Create Template'
      },
      {
        title: 'Update Template with Document'
      },
    ]

    return (
      <List>
        {
          list.map((item, i) => (
            <ListItem
              key={i}
              title={item.title}
              onPress={() => this.handlePress(item)}
            />
          ))
        }
      </List>
    )
 }

}

