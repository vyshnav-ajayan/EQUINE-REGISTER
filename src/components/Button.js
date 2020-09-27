import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity,Keyboard} from 'react-native';

// //Function Component
import { moderateScale } from 'react-native-size-matters';
import measures from '../utils/measures';


export function Button(props){
  return(
    <TouchableOpacity 
    style={{
      height:props.buttonType == "round" ? moderateScale(60) : moderateScale(40),
      width: props.buttonType == "round" ? moderateScale(60) : measures.ScreenWidth*.9,
      borderRadius: props.buttonType == "round" ? moderateScale(40) : 0,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:props.backgroundColor,
      borderColor:props.TextColor,
      borderWidth:moderateScale(.5),
      elevation:moderateScale(2)
      }}
      onPress={()=>{props.onPress()}}
      >
        <Text style={{fontSize:moderateScale(12),color:props.TextColor}}>
          {props.buttonLabel}
        </Text>

    </TouchableOpacity>
  )
}

