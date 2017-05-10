
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

import Toast from 'react-native-root-toast'

import { NavigationActions } from 'react-navigation'

import moment from 'moment';

import _ from 'lodash'

import { Button } from 'react-native-elements';

const TemplateFileObj = require('../../../assets/TestBlankTemplate.json');


export default class SendTemplateScreen extends React.Component {
  static navigationOptions = {
    title: 'Send From Template'
  }

  constructor(props) {
    super(props);
    this.state = {
      findingTemplate: true,
      createdTemplate: false,
      needTemplate: false,
      remoteTemplate: null,
    }

    this.fetchExistingTemplate = this.fetchExistingTemplate.bind(this);
    this.handleInsertTemplate = this.handleInsertTemplate.bind(this);
    this.handleSendEnvelopeFromTemplate = this.handleSendEnvelopeFromTemplate.bind(this);
    this.createRecipientView = this.createRecipientView.bind(this);
  }

  componentDidMount(){
    // Load envelopes for folder
    

    // // instantiate a new EnvelopesApi object
    // var foldersApi = new docusign.FoldersApi();
    // foldersApi.listItems(this.props.navigation.state.params.account.accountId, this.props.navigation.state.params.folder.folderId, {}, (err, folderItemsInfo, response) => {
    //   if(err){
    //     return alert('err: ' + JSON.stringify(err));
    //   }

    //   // alert(JSON.stringify(folderItemsInfo,null,2));
    //   this.setState({
    //     folderItems: folderItemsInfo.folderItems
    //   });

    // });

    this.fetchExistingTemplate();

  }

  fetchExistingTemplate(){
    // Get the template from the account
    // - fails if not exists

    // login call available off the AuthenticationApi
    var templatesApi = new docusign.TemplatesApi();
    templatesApi.listTemplates(this.props.navigation.state.params.account.accountId, {}, (error, templateList, response) => {
      if(error){
        alert('Error');
        return;
      }

      // See if our template already exists (by name) 
      // alert(JSON.stringify(templateList));

      var remoteTemplate = _.find(templateList.envelopeTemplates,{ name: TemplateFileObj.name });
      if(remoteTemplate){
        this.setState({
          findingTemplate: false,
          needTemplate: false,
          remoteTemplate: remoteTemplate
        });
      } else {
        this.setState({
          findingTemplate: false,
          needTemplate: true
        });
      }

    });
  }

  handleInsertTemplate(){

    this.setState({
      needTemplate: false
    });

    var templateJson = _.clone(TemplateFileObj);

    // use a unique template ID
    // - re-using a templateId for a template that is in the Trash will return a 201
    // - to make this easier we are matching on "name" in the fetchExistingTemplate() method
    delete templateJson.templateId;

    var template = new docusign.EnvelopeTemplate.constructFromObject(templateJson);
    template.envelopeTemplateDefinition= new docusign.EnvelopeTemplateDefinition.constructFromObject(templateJson);
    // // delete templateJson.templateId; // use a unique template ID
    // // templateJson.name = templateObj.name;
    // template.envelopeTemplateDefinition = new docusign.EnvelopeTemplateDefinition.constructFromObject(templateJson);

    // // load json into constructor
    // var template;
    // var templateDef = new docusign.EnvelopeTemplateDefinition.constructFromObject(templateJson);

    //   template = new docusign.EnvelopeTemplate.constructFromObject(templateJson);
    //   // template.constructFromObject(templateJson);
      // template.envelopeTemplateDefinition = templateDef;
    // }catch(err){
    //   // console.error('--Templates cannot be creating using NodeJS SDK (yet, bug to-be-fixed)! --');
    //   console.error(err.stack);
    //   alert('FAIL' + err.stack);
    //   return;
    // }

    // app.helpers.removeEmptyAndNulls(template);
    // alert('OK');
    // return;

    // alert(JSON.stringify(Object.keys(templateJson.envelopeTemplateDefinition)));
    // return;

    var templatesApi = new docusign.TemplatesApi();
    templatesApi.createTemplate(this.props.navigation.state.params.account.accountId, {envelopeTemplate:template}, (err, newTemplateDef, response) => {
      if(err){
        return console.error(response);
        // return console.error(err.response.error);
      }

      console.log('Saved template!');
      // alert('Saved Template!');
      this.fetchExistingTemplate();

    });

  }

  handleSendEnvelopeFromTemplate(){

    var envDef = new docusign.EnvelopeDefinition();
    envDef.emailSubject = 'Test Template1';
    envDef.emailBlurb = 'test email body';
    envDef.templateId = this.state.remoteTemplate.templateId;

    // create a template role with a valid templateId and roleName and assign signer info
    var tRoleApplicant = new docusign.TemplateRole();
    // tRoleApplicant.recipientId = "1";
    tRoleApplicant.roleName = 'awesomesigner';
    tRoleApplicant.name = 'RN User';
    tRoleApplicant.email = this.props.navigation.state.params.account.email;
    tRoleApplicant.clientUserId = '1';
    tRoleApplicant.recipientId = '1';

    var tabList = {
      text: [],
      number: []
    };
    tabList.text.push(docusign.helpers.makeTab('Text', {
      tabLabel: 'Text1',
      value: "testing this input!"
    }));

    // Set default Tab values in template
    var tabs = new docusign.TemplateTabs();
    tabs.textTabs = tabList.text;
    tRoleApplicant.tabs = tabs;


    // create a list of template roles and add our newly created role
    var templateRolesList = [];
    templateRolesList.push(tRoleApplicant);

    // assign template role(s) to the envelope
    envDef.templateRoles = templateRolesList;

    // send the envelope by setting |status| to "sent". To save as a draft set to "created"
    // - note that the envelope will only be 'sent' when it reaches the DocuSign server with the 'sent' status (not in the following call)
    envDef.status = 'sent';

    Toast.show('Creating Envelope');

    // instantiate a new EnvelopesApi object
    var envelopesApi = new docusign.EnvelopesApi();
    envelopesApi.createEnvelope(this.props.navigation.state.params.account.accountId, {'envelopeDefinition': envDef}, (error, envelopeSummary, response) => {
      if (error) {
        console.error('Error: ' + response);
        console.error(envelopeSummary);
        res.send('Error creating envelope, please try again');
        return;
      }


      var envelopeId = envelopeSummary.envelopeId;

      this.createRecipientView(envelopeId);

    });

  }

  createRecipientView(envelopeId){

    // Create RecipientView
    var returnUrl = {};
    returnUrl.returnUrl = 'https://www.docusign.com/devcenter';
    returnUrl.authenticationMethod = 'email';
    returnUrl.userName = 'RN User';
    returnUrl.email = this.props.navigation.state.params.account.email;
    returnUrl.clientUserId = '1';
    returnUrl.recipientId = '1';

    Toast.show('Getting Signing View');

    var envelopesApi = new docusign.EnvelopesApi();
    envelopesApi.createRecipientView(this.props.navigation.state.params.account.accountId, envelopeId, {recipientViewRequest:returnUrl}, (err, returnUrlResponse, response) => {
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

  }

  render() {

    return (
      <ScrollView>

        <View style={styles.textHelp}>
          <View>
            <Text>
              Create Template Page
            </Text>
          </View>
          <View>
            <Text>
              Learn about API Rules and Limits, then check out Connect, or Firebase
            </Text>
          </View>
        </View>

        {
          this.state.needTemplate ? 
            <View>
              <Text style={styles.textHelp}>
                The template has not been created yet. 
              </Text>
              <Button
                raised
                icon={{name: 'home', size: 32}}
                buttonStyle={{backgroundColor: '#2c6ee1', borderRadius: 2}}
                textStyle={{textAlign: 'center'}}
                title={'Create Template'}
                onPress={this.handleInsertTemplate} />
            </View>
          :
            <View>
              <Text style={styles.textHelp}>
                Template Exists!
              </Text>
              <Button
                raised
                icon={{name: 'home', size: 32}}
                buttonStyle={{backgroundColor: '#2c6ee1', borderRadius: 2}}
                textStyle={{textAlign: 'center'}}
                title={'Send from Template'}
                onPress={this.handleSendEnvelopeFromTemplate} />
            </View>
        }

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
