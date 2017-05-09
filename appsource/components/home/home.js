
import React, { Component } from 'react';
import {
  ActionSheetIOS,
  StyleSheet,
  Text,
  Switch,
  Image,
  View,
  ScrollView
} from 'react-native';

import { List, ListItem } from 'react-native-elements'

import { NavigationActions } from 'react-navigation'


import SendEnvelopeFromDocument from './SendEnvelopeFromDocument';
import SendEnvelopeFromDocuments from './SendEnvelopeFromDocuments';
import ViewFolder from './ViewFolder';


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
  }

  constructor(props) {
    super(props);
    this.state = {
      account: props.navigation.state.params.account
    }

    this.handleViewFolder = this.handleViewFolder.bind(this);
    this.handleSendEnvelopeFromTemplate = this.handleSendEnvelopeFromTemplate.bind(this);
  }

  handleViewFolder(){

    this.props.navigation.dispatch( NavigationActions.navigate({ routeName: 'ViewFolders', params: {
      account: this.state.account
    }}) );

  }

  handleSendEnvelopeFromTemplate(){

    this.props.navigation.dispatch( NavigationActions.navigate({ routeName: 'SendEnvelopeFromTemplate', params: {
      account: this.state.account
    }}) );

  }

  render() {

    return (
      <ScrollView>
        <List>
          <SendEnvelopeFromDocument
            account={this.state.account}
           />
          <SendEnvelopeFromDocuments
            account={this.state.account}
           />
          <ListItem
            title="Send Envelope From Template"
            onPress={this.handleSendEnvelopeFromTemplate}
          />
          <ListItem
            title="View Folders and Envelopes"
            onPress={this.handleViewFolder}
          />

        </List>
      </ScrollView>
    )
 }

}

