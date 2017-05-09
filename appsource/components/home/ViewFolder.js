
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
      folderItems: []
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
                onPress={o => this.handleFolderEnvelope(envelope)}
              />
            ))
          }
        </List>
      </ScrollView>
    )
 }

}

