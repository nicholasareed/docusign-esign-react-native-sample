import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Modal,
  View,
  Image,
  Dimensions,
  TextInput,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';

import Reflux from 'reflux';

import { Button } from 'react-native-elements'

const { width, height } = Dimensions.get("window");

import { NavigationActions } from 'react-navigation'

// const homeReset = NavigationActions.reset({
//   index: 0,
//   actions: [
//     NavigationActions.navigate({ routeName: 'Home'})
//   ]
// })

import RNFetchBlob from 'react-native-fetch-blob'
// android
const FilePickerManager = require('NativeModules').FilePickerManager;
// ios
const DocumentPicker = require('react-native').NativeModules.RNDocumentPicker;


export default class LoginScreen extends Reflux.Component {

  static navigationOptions = {
    header:{
      visible: false
    }
  }

  constructor(props) {
    super(props);
    this.state = {}
    this.handleOAuth = this.handleOAuth.bind(this);
    this.handleUsernamePassword = this.handleUsernamePassword.bind(this);
  }

  handleOAuth() {

    this.props.navigation.dispatch( NavigationActions.navigate({ routeName: 'LoginOAuth'}) );

  }

  handleUsernamePassword(){
    
    this.props.navigation.dispatch( NavigationActions.navigate( { routeName: 'LoginUsernamePassword' }) );

    return;



    // RNFetchBlob.fs.readFile(RNFetchBlob.fs.asset("blank.pdf"),'base64')
    // .then((base64Str) => {
    //   alert('GOT FILE');
    //   // this.sendEnvelope(account, base64Str);
    // })
    // .catch((error)=>{
    //   alert('Failed: ' + error)
    // })


    // return;



    var url = 'https://github.com/docusign/docusign-rest-recipes/raw/node-sdk/_sample_documents/blank.pdf';

    url = RNFetchBlob.fs.asset('blank.pdf');
    // alert(url);



      // send http request in a new thread (using native code)
    // RNFetchBlob.fetch('GET', RNFetchBlob.wrap(response.uri), {
    RNFetchBlob.fs.readFile(RNFetchBlob.fs.asset('blank.pdf'),'base64')
    .then((base64Str) => {
      this.sendEnvelope(account, base64Str);
    });

    return;

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
          setTimeout(() => {
            // alert(1);
            // alert(JSON.stringify(response));
            // alert(response.path);
            // alert(response.uri);
            // this.setState({
            //   file: response
            // });
            // return;
            // response.path = response.path = "g";
            // alert(response.uri);

            // RNFetchBlob.fs.exists(response.path)
            //   // when response status code is 200
            //   .then((exist) => {
            //     // the conversion is done in native code
            //     // alert(`file ${exist ? '' : 'DOES NOT'} exist`);
            //     alert((typeof exist) + JSON.stringify(exist));


            //   })
            //   // Status code is not 200
            //   .catch((errorMessage, statusCode) => {
            //     // error handling
            //     alert('Failed exists: ' + errorMessage);
            //   })


            // return;


              // send http request in a new thread (using native code)
            // RNFetchBlob.fetch('GET', RNFetchBlob.wrap(response.uri), {
            RNFetchBlob.fs.readFile(response.uri,'base64')
            //   // Authorization : 'Bearer access-token...',
            //   'Content-Type' : 'application/octet-stream' ,
            //   // more headers  ..
            // })
            // when response status code is 200
            .then((res) => {
              // the conversion is done in native code

              // alert('data ok');
              // return;
              // alert(atob(res));
              // let base64Str = res.base64()
              // alert(base64Str);
              // return;
              // // the following conversions are done in js, it's SYNC
              // let text = res.text()
              // let json = res.json()

              var base64Str = res;

              if(base64Str && base64Str.length){
                alert('GOT IT2! ' + base64Str.length)
                // this.sendEnvelope(account, base64Str);
              } else {
                alert("failed base64Str");
              }

            })
            // Status code is not 200
            .catch((errorMessage, statusCode) => {
              // error handling
              alert('Failed fetching: ' + errorMessage);
            })

          },1000);



        }
      });
    } else {
      // ios

      // iPhone/Android
      DocumentPicker.show({
          filetype: ['public.content','public.data','public.image'],
        },(error,url) => {
          alert(url);
        });
    }


    return;

    //     // send http request in a new thread (using native code)
    // // RNFetchBlob.exists(RNFetchBlob.wrap(RNFetchBlob.fs.asset('blank.pdf')))
    // RNFetchBlob.fs.exists(RNFetchBlob.fs.asset('blank.pdf'))
    //   // when response status code is 200
    //   .then((exist) => {
    //     // the conversion is done in native code
    //     alert(`file ${exist ? '' : 'DOES NOT'} exist`);


    //   })
    //   // Status code is not 200
    //   .catch((errorMessage, statusCode) => {
    //     // error handling
    //     alert('Failed exists: ' + errorMessage);
    //   })


    // // return;
    // var PATH_TO_READ = RNFetchBlob.fs.asset('blank.pdf');

    // RNFetchBlob.fs.readStream(PATH_TO_READ, 'utf8')
    // .then((stream) => {
    //     // alert('instream');
    //     let data = ''
    //     stream.open()
    //     stream.onData((chunk) => {
    //         data += chunk
    //     })
    //     stream.onEnd(() => {
    //         console.log(data)
    //         alert('DONE');
    //     })
    // })
    // .catch((errorMessage, statusCode) => {
    //   // error handling
    //   alert('Failed fetching2: ' + errorMessage);
    // })

    // return;

        // send http request in a new thread (using native code)
    // RNFetchBlob.fetch('GET', RNFetchBlob.fs.asset('blank.pdf'), {
      RNFetchBlob.fs.readFile(RNFetchBlob.wrap(RNFetchBlob.fs.asset('blank.pdf')))
        // Authorization : 'Bearer access-token...',
        // 'Content-Type' : 'application/octet-stream' ,
        // more headers  ..
      // })
      // when response status code is 200
      .then((res) => {
        // the conversion is done in native code

        alert('data ok');
        return;

        let base64Str = res.base64()
        // // the following conversions are done in js, it's SYNC
        // let text = res.text()
        // let json = res.json()

        if(base64Str && base64Str.length){
          alert('GOT IT! ' + base64Str.length)
          // this.sendEnvelope(account, base64Str);
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

  render() {

    // const rootNavigator = this.props.navigation.getNavigator('root');

    console.log('-----LOGIN RENDER!----');
    return (
      <View style={styles.outerContainer}>
        <View style={styles.markWrap}>
          {/*<Image source={mark} style={styles.mark} resizeMode="contain" />*/}
        </View>
        <Text style={styles.title}>DocuSign</Text>
        <View style={styles.container}>
          <Button title="OAuth" onPress={this.handleOAuth} />
          <Text></Text>
          <Button title="Username/Password" onPress={this.handleUsernamePassword} />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
  },
  markWrap: {
    flex: 1,
    paddingVertical: 30,
  },
  mark: {
    width: null,
    height: null,
    flex: 1,
  },
  background: {
    width,
    height,
  },
  title: {
    fontSize: 24,
    textAlign: 'center'
  },
  wrapper: {
    paddingVertical: 30,
  },
  inputWrap: {
    flexDirection: "row",
    marginVertical: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC"
  },
  iconWrap: {
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 20,
    width: 20,
  },
  input: {
    color: '#111',
    flex: 1,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#448aff",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
  },
  forgotPasswordText: {
    color: "#D8D8D8",
    backgroundColor: "transparent",
    textAlign: "right",
    paddingRight: 15,
  },
  signupWrap: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  accountText: {
    color: "#D8D8D8"
  },
  signupLinkText: {
    color: "#555",
    marginLeft: 5,
  }
});