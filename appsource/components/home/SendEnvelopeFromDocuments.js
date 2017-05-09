
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

import Toast from 'react-native-root-toast';

import ActionSheet from 'react-native-actionsheet'

import RNFetchBlob from 'react-native-fetch-blob'
// android
const FilePickerManager = require('NativeModules').FilePickerManager;
// ios
const DocumentPicker = require('react-native').NativeModules.RNDocumentPicker;


const CANCEL_INDEX = 0
// const DESTRUCTIVE_INDEX = 4
const options = [ 'Cancel', 'Remote URL', 'Local Asset', 'Choose File' ]
const title = 'Where to get Sample PDF File?'

export default class ExampleListItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      account: props.account
    }
    this.handleASPress = this.handleASPress.bind(this)
    this.sendEnvelope = this.sendEnvelope.bind(this);
    this.handleSendFromDocument = this.handleSendFromDocument.bind(this);
  }

  handleSendFromDocument(){

    this.ActionSheet.show()

  }

  handleASPress(i){

    switch(i){
      case 1:
        // Use remote URL
        this.useRemoteUrlFile();
        break;

      case 2:
        // Use local asset file
        this.useAssetFile('blank.pdf');
        break;

      case 3:
        // Choose file
        this.useChooseFile();
        break;
    }

  }

  useRemoteUrlFile(){

    var url = 'https://github.com/docusign/docusign-rest-recipes/raw/node-sdk/_sample_documents/blank.pdf';
    RNFetchBlob.fetch('GET', url, {
        // Authorization : 'Bearer access-token...',
        // more headers  ..
      })
      // when response status code is 200
      .then((res) => {
        // the conversion is done in native code
        let base64Str = res.base64();

        if(base64Str && base64Str.length){
          // alert('GOT IT! ' + base64Str.length)
          this.sendEnvelope(base64Str);
        } else {
          alert("failed base64Str");
        }

      })
      // Status code is not 200
      .catch((errorMessage, statusCode) => {
        // error handling
        alert('Failed fetching: ' + errorMessage);
      })

  }

  useAssetFile(assetPath){

    RNFetchBlob.fs.readFile(RNFetchBlob.fs.asset(assetPath),'base64')
    .then((base64Str) => {
      this.sendEnvelope(base64Str);
    });

  }

  useChooseFile(){

    // Android
    if(Platform.OS === 'android'){
      FilePickerManager.showFilePicker(null, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled file picker');
        }
        else if (response.error) {
          console.log('FilePickerManager Error: ', response.error);
        }
        else {
          // slight delay after fetching file
          this.fetchLocalFile(response.uri);
        }
      });
    } else {
      // ios
      DocumentPicker.show({
          filetype: ['public.content','public.data','public.image'],
        },(error, data) => {
          if(error){
            return;
          }
          var uri = data.uri;
          if(uri.indexOf('file://') === 0){
            uri = uri.substr(7);
          }
          this.fetchLocalFile(uri);
        });
    }

  }

  fetchLocalFile(filePath){

    // slight delay before fetching local file
    setTimeout(() => {
      RNFetchBlob.fs.readFile(filePath,'base64')
      .then((base64Str) => {
        this.sendEnvelope(base64Str);
      })
      // Status code is not 200
      .catch((errorMessage, statusCode) => {
        // error handling
        alert('Failed fetching: ' + errorMessage);
      })

    },250);

  }

  sendEnvelope(base64Data){


    // alert(JSON.stringify(account));
    // return;
    var envDef = {};
    envDef.emailSubject = "DocuSign API - React Native Test";
    envDef.status = "sent"; // comment out for "draft" or "created" status (not sent)
    envDef.recipients = {};

    var signers = [];
    var signer1 = {};
    var signer1tabs = {};
    var signer1SignhereTabs = [];
    var signer1signHereTab = {};
    signer1.email = this.state.account.email;
    signer1.name = "RN User";
    signer1.recipientId = "1";
    signer1.clientUserId = "1";
    signer1signHereTab.xPosition = "100";
    signer1signHereTab.yPosition = "100";
    signer1signHereTab.documentId = "1";
    signer1signHereTab.pageNumber = "1";

    signer1SignhereTabs.push(signer1signHereTab);
    signer1tabs.signHereTabs = signer1SignhereTabs;

    signer1.tabs = signer1tabs;
    signers.push(signer1);

    envDef.recipients.signers = signers;

    var documents = [];
    var document1 = {};
    document1.documentId = "1";
    document1.name = "blank1.pdf";
    document1.documentBase64 = base64Data;
    documents.push(document1);

    envDef.documents = documents;

    var params = {
      cdseMode: 'false',
      mergeRolesOnDraft: 'false'
    }


    Toast.show('Sending');


    // instantiate a new EnvelopesApi object
    var envelopesApi = new docusign.EnvelopesApi();

    // call the createEnvelope() API
    envelopesApi.createEnvelope(this.state.account.accountId, {'envelopeDefinition': envDef}, (err, envelopeInfo, response) => {
      if (err) {
        return next(err);
      }
      console.log('EnvelopeSummary: ' + JSON.stringify(envelopeInfo));

      var envelopeId = envelopeInfo.envelopeId;

      var returnUrl = {};
      returnUrl.returnUrl = 'https://www.docusign.com/devcenter';
      returnUrl.authenticationMethod = 'email';
      returnUrl.email = this.state.account.email;
      returnUrl.userName = 'RN User';
      returnUrl.clientUserId = '1';
      returnUrl.recipientId = '1';

      Toast.show('Getting Signing View');

      var envelopesApi = new docusign.EnvelopesApi();
      envelopesApi.createRecipientView(this.state.account.accountId, envelopeId, {recipientViewRequest:returnUrl}, (err, returnUrlResponse, response) => {
        if(err){
          alert('Error: ' + response.status);
          console.error(err);
          return;
        }

        // redirect to the embedded signing page
        this.props.navigation.dispatch( NavigationActions.navigate({ routeName: 'EmbeddedSigning', params: {
          url: returnUrlResponse.url,
          returnUrl: returnUrl.returnUrl
        }}) );


      });

    })

  }

  render() {

    return (
      <View>
        <ListItem
          title="Send Multiple Documents"
          subtitle="Multiple recipients"
          onPress={this.handleSendFromDocument}
        />
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={title}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          onPress={this.handleASPress}
        />
      </View>
    )
 }

}

