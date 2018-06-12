
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

import axios from 'axios'

import { List, ListItem } from 'react-native-elements'

import { NavigationActions } from 'react-navigation'

import moment from 'moment';

export default class ViewFolderScreen extends React.Component {
  static navigationOptions = {
    title: 'View Envelope'
  }

  constructor(props) {
    super(props);
    this.state = {
      folderItems: [],
      envelopes: []
    }

    this.handleFolderEnvelope = this.handleFolderEnvelope.bind(this);

  }

  componentDidMount(){
   // Load envelopes for folder
    
    
    // instantiate a new EnvelopesApi object
    
  
    let foldersApi = new docusign.FoldersApi();
    foldersApi.listItems(this.props.navigation.state.params.account.accountId, this.props.navigation.state.params.folder.folderId, {}, (err, folderItemsInfo, response) => {
      if(err){
        return alert('err: ' + JSON.stringify(err));
      }
      
      // alert(JSON.stringify(folderItemsInfo,null,2));
      this.setState({
        folderItems: folderItemsInfo.folderItems
      });
      
      // axios.get('https://demo.docusign.net/restapi/v2/accounts/'+ this.props.navigation.state.params.account.accountId + '/envelopes/0891cbcf-2b3e-47eb-a752-31b31156634f')
      //   .then(response => AlertIOS(response))
    });

  }

  handleFolderEnvelope(folder){
    console.log(JSON.stringify(folder));
  }

  render() {

    return (
      <ScrollView>

        <View style={styles.textHelp}>
          <View>
            <Text>
              Querying an envelope should be a cached call! 
            </Text>
          </View>
          <View>
            <Text>
              Learn about API Rules and Limits, then check out Connect, or Firebase
            </Text>
          </View>
        </View>
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

var styles = {
  textHelp: {
    backgroundColor: '#fff5d7',
    margin: 8,
    padding: 8
  }
}

