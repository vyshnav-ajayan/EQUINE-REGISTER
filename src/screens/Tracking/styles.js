import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import Metrics from '../../utils/measures';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Color from '../../utils/color';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  contentContainer:{
    flex:1,
    backgroundColor:'white',
    justifyContent:'flex-end',
  },
  whiteContainer:{
    flex:1,
    backgroundColor:'white',
    borderBottomWidth:.5,
    borderColor:'lightgrey',
    justifyContent:'flex-start',
    alignItems:'center'
  },
  buttonContainer:{
    flex:2,
    justifyContent:'space-around',
    alignItems:'center',
    backgroundColor:'white',
    flexDirection:'row',
    paddingHorizontal:moderateScale(100)
  },
  sectionContainer:{
    flex:1.5,
    backgroundColor:'white',
    flexDirection:'row',
    borderBottomWidth:.5,
    borderColor:'lightgrey'
  },
  subContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  commonText:{
    fontSize:moderateScale(12),
    color:Color.colors.PRIMARY_COLOR
  },
  FooterText:{
    fontSize:moderateScale(18),
    fontWeight:'bold',
    color:Color.colors.BLACK_COLOR  },
  activityHeaderText:{
      fontSize:moderateScale(15),
      fontWeight:'bold',
      color:Color.colors.WHITE_COLOR
    },
  dateTimeText:{
      fontSize:moderateScale(14),
    //fontWeight:'bold',
    color:Color.colors.WHITE_COLOR 
    }
  
})

export default styles;