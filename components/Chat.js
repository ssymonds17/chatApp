import * as React from 'react';
import NetInfo from '@react-native-community/netinfo';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { StyleSheet, View, Platform, AsyncStorage } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import CustomActions from './CustomActions';
const firebase = require('firebase');
require('firebase/firestore');

/**
 * @class chat
 * @requires React
 * @requires React-native
 * @requires react-native-keyboard-spacer
 * @requires react-native-gifted-chat
 * @requires react-native-community/netinfo
 * @requires CustomActions from './CustomActions'
 * @requires firebase
 * @requires firestore
 */

export default class Chat extends React.PureComponent {

  constructor() {
    super();

    /**
     * firestore credentials
     * @param {string} apiKey
     * @param {string} authDomain
     * @param {string} databaseURL
     * @param {string} projectId
     * @param {string} storageBucket
     * @param {string} messageSenderId
     * @param {string} appId
     * @param {string} measurementId
     */

    //get and store messages to be rendered
    this.state = {
      messages: [],
      uid: 0,
      // isConnected: false,
      image: null,
      location: null,
    };


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
  };

  /**
   * NetInfo checks if user is online and sets state appropriately
   * firebase uses anonymous authentication
   * subscribes authenticated user to firestore collection
   * retrieves messages in firestore
   */

  componentDidMount() { // Changed from componentWillMount. Documentation displayed deprecated method
    NetInfo.fetch().then((state) => {
      // check if application is online
      if (state.isConnected == true) {
        console.log('online ' + state.isConnected);
        this.setState({
          isConnected: true,
        })
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          // update user state with currently active user data
          this.setState({
            uid: user.uid,
          });
          //listen for collection changes for current user
          this.referenceMessageUser = firebase.firestore().collection('messages').where("uid", "==", this.state.uid);
          this.unsubscribeMessageUser = this.referenceMessageUser.onSnapshot(this.onCollectionUpdate);
        });
      } else {
        // User is offline
        this.setState({
          isConnected: false,
        });
        console.log('offline ' + state.isConnected)
        this.getMessages();
      }
    });
  };

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribeMessageUser();
  }

  /**
   * Updates message state when chat window is opened
   * @function onCollectionUpdate
   * @param {string} _id
   * @param {string} text - text message
   * @param {date} createdAt - date/time of message creation
   * @param {string} user
   * @param {string} image - uri
   * @param {number} location - geo coordinates
   */

  // updates message state when chat window is opened
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the queried document snapshot data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || '',
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  };

  /**
   * Adds the message the firebase database
   * @function addMessage
   * @param {number} _id
   * @param {string} text
   * @param {date} createdAt
   * @param {number} uid
   * @param {object} user - id, name and avatar
   * @param {image} image
   * @param {number} location - coordinates
   */

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
      image: message.image || '',
      location: message.location || null,
    });
  };

  /**
   * If user goes offline messages are stored in async storage
   * @function getMessages
   * @return messages
   */

  // loads the messages saved to async storage
  getMessages = async () => {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message)
    }
  };

  /**
   * Saves messages to asyncStorage
   * @async
   * @function saveMessagetoStorage
   * @return {Promise<AsyncStorage>} message in asyncStorage
   */

  // saves messages to async storage
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message)
    }
  }

  /**
   * Deletes messages from asyncStorage. Currently not used but written incase it is needed
   * @async
   * @function deleteMessages
   * @param {none}
   */

  // deletes messages from async storage
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * New typed messages get appended to the messages object
   * @function onSend
   * @param {*} messages - message can be: {message/image/location}
   * @returns {state} updates state with message
   */

  // New typed messages get appended to the messages object
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }),
      () => {
        this.addMessage();
        this.saveMessages();
      });
  }

  /**
   * Changes the bubble colour for the user
   * @function renderBubble
   * @param {*} props 
   */

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

  /**
   * Render the input toolbar only when user is online
   * @function renderInputToolbar
   * @param {*} props
   * @returns {InputToolbar}
   */

  // render input toolbar only when user is online
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  /**
   * Uses CustomActions defined in CustomActions component
   */

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  }

  /**
   * If currentMessage has location coords then mapview is returned
   * @function renderCustomView
   * @param {*} props
   * @returns {MapView}
   */

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <View>
          <MapView
            style={{
              width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3
            }}
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      );
    }
    return null;
  }

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={[styles.container, { backgroundColor: this.props.route.params.color }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          renderCustomView={this.renderCustomView.bind(this)}
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
