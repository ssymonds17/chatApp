import * as React from 'react';
import { StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity, Button, View } from 'react-native';

export default class Chat extends React.PureComponent {

 render() {
  let name = this.props.route.params.name;
  this.props.navigation.setOptions({ title: name });

  return (
   <View style={[styles.container, { backgroundColor: this.props.route.params.color }]}>
    <Text style={{ color: '#FFFFFF' }}>Hello {this.props.route.params.name}</Text>
   </View>
  );
 }
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#FFF',
  alignItems: 'center',
  justifyContent: 'center'
 }
});
