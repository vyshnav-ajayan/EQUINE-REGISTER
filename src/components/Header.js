import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';

import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import {BackArrow, Logo, Close} from '../utils/svg'
import { TextInput } from 'react-native-gesture-handler';
import Color from '../utils/color';
let phNO='';

export default class TabsHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    
  }
  
 
  render() {
    return (
      <View>
        <View  style={styles.topContainer}>
                <TouchableOpacity style={styles.buttonContainer}
                onPress={()=>{this.props.onPress()}}
                >
                    <Close/>
                    
                </TouchableOpacity>
                <View style={styles.LogoContainer}>
                  <Logo/>
                </View>
                <View style={{flex:1}}/>
               
        </View>
      {/* </LinearGradient> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    height:moderateScale(70),
    width:'100%',
    paddingHorizontal:moderateScale(7),
   backgroundColor:'white',
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row'
  },
  buttonContainer:{
      flex:1,
      alignItems:'flex-start',

  },
  BackButtonText:{
    fontSize:moderateScale(14),
    marginLeft:moderateScale(2),
    color:Color.colors.PRIMARY_COLOR
  },
  LogoContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  }
  
  
});
