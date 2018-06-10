import React, { Component } from 'react';
import {
  ActionSheetIOS,
  StyleSheet,
  Text,
  Switch,
  Image,
  View,
  ScrollView,
  AlertIOS
} from 'react-native';
import  TouchID from 'react-native-touch-id'

import { List, ListItem } from 'react-native-elements'

import { NavigationActions } from 'react-navigation'

import moment from 'moment';

export default class ViewFolderScreen extends React.Component {
  static navigationOptions = {
    title: (navigation) => {
      return navigation.state.params.folder.name;
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      folderItems: [],
      touchID: false
    }

    this.handleFolderEnvelope = this.handleFolderEnvelope.bind(this);

  }

  componentDidMount(){
    // Load envelopes for folder
    
    var foldersApi = new docusign.FoldersApi();
    foldersApi.listItems(this.props.navigation.state.params.account.accountId, this.props.navigation.state.params.folder.folderId, {}, (err, folderItemsInfo, response) => {
      if(err){
        return alert('err: ' + JSON.stringify(err));
      }

      // alert(JSON.stringify(folderItemsInfo,null,2));
      this.setState({
        folderItems: folderItemsInfo.folderItems
      });

    });

  }

  handleFolderEnvelope(envelope){
    this.props.navigation.dispatch( NavigationActions.navigate({ routeName: 'ViewEnvelope', params: {
      account: this.props.navigation.state.params.account,
      folder: this.props.navigation.state.params.folder,
      envelope: envelope
    }}) );
  }
  _pressHandler() {
    TouchID.authenticate('to demo this react-native component')
      .then(success => {
        AlertIOS.alert('Authenticated Successfully');
        this.setState({touchID: true})
      })
      .catch(error => {
        AlertIOS.alert('Authentication Failed');
      });
  }

  render() {

    return (
      <ScrollView>
        <List>
          {
            this.state.folderItems.map((envelope, i) => (
              <ListItem
                key={i}
                title={envelope.subject}
                subtitle={moment(envelope.createdDateTime).format('MMM Do, h:mma') + ' - ' + envelope.envelopeId.substr(0,11) + '...'}
                onPress={o => !this.state.touchID ? this._pressHandler() : this.handleFolderEnvelope(envelope)}
              />
            ))
          }
        </List>
      </ScrollView>
    )
 }

}