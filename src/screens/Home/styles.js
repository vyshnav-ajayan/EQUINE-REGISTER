import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  contentContainer:{
    flex:1,
    backgroundColor:'#fff',
    justifyContent:'flex-end',
  },
  whiteContainer:{
    flex:1,
    backgroundColor:'white',
    borderBottomWidth:.5,
    borderColor:'lightgrey',
  },
  buttonContainer:{
    flex:2,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white'
  }
  
})

export default styles;