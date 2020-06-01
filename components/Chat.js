import * as React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity, Button, View, Platform } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends React.PureComponent {

  constructor() {
    super();

    //connect to firestore
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDaebOPcKXjIPzxEdWfva35O7Oev4vOpVc",
        authDomain: "chat-app-96b4a.firebaseapp.com",
        databaseURL: "https://chat-app-96b4a.firebaseio.com",
        projectId: "chat-app-96b4a",
        storageBucket: "chat-app-96b4a.appspot.com",
        messagingSenderId: "463246736893",
        appId: "1:463246736893:web:0470e6c18b8f82303ded94",
        measurementId: "G-DG3E17ECLW"
      });
    }

    //reference collection
    this.referenceMessages = firebase.firestore().collection('messages');

    //get and store messages to be rendered
    this.state = {
      messages: [],
      uid: 0,
    };
  }

  componentDidMount() { // Changed from componentWillMount. Documentation displayed deprecated method
    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      // update user state with currently active user data
      this.setState({
        uid: user.uid,
      });

      this.referenceMessageUser = firebase.firestore().collection('messages').where("uid", "==", this.state.uid);

      //listen for collection changes for current user
      this.unsubscribeMessageUser = this.referenceMessageUser.onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribeMessageUser();
  }

  // updates message state when chat window is opened
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the queried document snapshot data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
    });
  };

  // adds message to database
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      uid: this.state.uid,
      user: {
        _id: this.state.uid,
        name: this.props.route.params.name,
        avatar: '',
      },
    });
  };

  // New typed messages get appended to the messages object
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }),
      () => {
        this.addMessage();
      });
  }

  // Change the bubble colour
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#FF6347'
          }
        }}
      />
    )
  }

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={[styles.container, { backgroundColor: this.props.route.params.color }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{ _id: this.state.uid }}
          // Text blocking keyboard issue for Android devices is avoided and KeyboardSpacer component is utilised
          {...Platform.OS === 'android' ? <KeyboardSpacer /> : null}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  }
});
