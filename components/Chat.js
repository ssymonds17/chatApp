import * as React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity, Button, View, Platform } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';


export default class Chat extends React.PureComponent {

 state = {
  messages: []
 };

 // Static message to display UI elements
 componentDidMount() { // Changed from componentWillMount. Documentation displayed deprecated method
  let name = this.props.route.params.name;
  this.setState({
   messages: [
    {
     _id: 1,
     text: 'Hello ' + name,
     createdAt: new Date(),
     user: {
      _id: 2,
      name: 'React Native',
      avatar: 'https://placeimg.com/140/140/any',
     },
    },
    {
     _id: 2,
     text: 'This is a system message',
     createdAt: new Date(),
     system: true,
    },
   ],
  })
 }

 // New typed messages get appended to the messages object
 onSend(messages = []) {
  this.setState(previousState => ({
   messages: GiftedChat.append(previousState.messages, messages),
  }))
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
     user={{
      _id: 1,
     }}
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
