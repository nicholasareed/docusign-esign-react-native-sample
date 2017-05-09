
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

export default class ViewFolderScreen extends React.Component {
  static navigationOptions = {
    title: 'Folders'
  }

  constructor(props) {
    super(props);
    this.state = {
      folders: []
    }

    this.handleFolder = this.handleFolder.bind(this);

  }

  componentDidMount(){
    // Load envelopes for folder
    
    var foldersApi = new docusign.FoldersApi();
    foldersApi.list(this.props.navigation.state.params.account.accountId, {}, (err, folderInfo, response) => {
      if(err){
        return alert('err: ' + JSON.stringify(err));
      }

      this.setState({
        folders: folderInfo.folders
      });

    });

  }

  handleFolder(folder){

    this.props.navigation.dispatch( NavigationActions.navigate({ routeName: 'ViewFolder', params: {
      account: this.props.navigation.state.params.account,
      folder: folder
    }}) );

  }

  render() {

    return (
      <ScrollView>
        <List>
          {
            this.state.folders.map((folder, i) => (
              <ListItem
                key={i}
                title={folder.name}
                subtitle={folder.folderId.substr(0,11) + '...'}
                onPress={o => this.handleFolder(folder)}
              />
            ))
          }
        </List>
      </ScrollView>
    )
 }

}

