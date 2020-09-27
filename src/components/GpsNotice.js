import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

import { moderateScale} from 'react-native-size-matters';


export default class GpsStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddMemberModal: false,
    }
    
  }
  render() {
    return (
      <View>
        <View  style={[styles.main,{backgroundColor:this.props.backgroundColor}]}>
                <Text style={styles.statusText}>
                    {this.props.Label}
                </Text>
               
        </View>
      {/* </LinearGradient> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    height:moderateScale(40),
    width:'100%',
    paddingHorizontal:moderateScale(5),
   backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  
  statusText:{
    fontSize:moderateScale(12),
    color:'#ffffff'
   
  },
  
  
  
});
