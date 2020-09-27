import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  BackHandler,
  SafeAreaView,
  StatusBar,
  Platform,
  Linking,
  Image,
} from 'react-native';

import Toast from 'react-native-simple-toast';
import { showMessage, hideMessage } from "react-native-flash-message";
import MapboxGL from "@react-native-mapbox-gl/maps";
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request, RESULTS} from 'react-native-permissions';


import {Button} from '../../components/Button';
import styles from './styles';
import Header from '../../components/GpsHeader';
import GpsNotice from  '../../components/GpsNotice';
import Color from '../../utils/color';
import {EquineAlert} from '../../utils/helperUtils';

MapboxGL.setAccessToken("sk.eyJ1IjoiYXNoYXJ5ayIsImEiOiJjazlkd3V4M2EwN2F2M210OW14YThhYmZ2In0.R3YGEmDFk_xphmFf3Gq8Jg");


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude:0,
      longitude:0,
      hasPermission:false
    };
    this.goBackWarn =false;
  }
 
  componentDidMount() {
    
    MapboxGL.setTelemetryEnabled(false);
    this.checkIfPermissionsAreEnabled();
  }


    getLocation =(isNavigate = false)=>{
      Geolocation.getCurrentPosition(
        async position => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              hasPermission:true ,
            },()=>{
              const{longitude,latitude} = this.state ;
              {isNavigate && this.props.navigation.navigate('Track',{longitude:longitude,latitude:latitude})}
            })
        },
        error => {
          console.log('location error', error),
            Toast.showWithGravity(
              'Error in getting your location',
              Toast.LONG,
              Toast.CENTER,
            );
        },
        {enableHighAccuracy:true,
        timeout:15000,
        maximumAge:10000}
      );
    }

  


  checkIfPermissionsAreEnabled = () => {
    console.log("request permission reached");
    
  request(
    Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
  ).then(checkIfEnabled => {
    // console.log("permission status==",checkIfEnabled,RESULTS);

    if (checkIfEnabled == RESULTS.GRANTED) {
      this.getLocation()
      
    } else if (checkIfEnabled == RESULTS.DENIED) {
      // console.log("permission status==",checkIfEnabled);
    } else if (checkIfEnabled == RESULTS.BLOCKED) {
      // console.log("vysh reached==");
      
      EquineAlert(
        'Permission blocked',
        'Allow location permission in settings',
        'Ok',
        'Close',
        () => Linking.openSettings(),
      );
     
    } else {
      console.log("permission status==22",checkIfEnabled);
      Toast.showWithGravity(
        'Permission denied, allow location permission to continue',
        Toast.SHORT,
        Toast.CENTER,
      );
    }
  });
};

handleBackPress=()=> {
  this.goBackWarn
    ? BackHandler.exitApp()
    : (Toast.show('Press again to exit'), (this.goBackWarn = true));
  }

  onStart=()=>{
    this.getLocation(true)
  }

  render() {
    console.disableYellowBox = true;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle="dark-content" />
        <Header Label={'Exit'} onPress={()=>{this.handleBackPress()}}/>
        {this.state.hasPermission?
        (<GpsNotice Label={'GPS SIGNAL ACQUIRED'} backgroundColor={'#28B463'}/>)
        :null}
        <View style={styles.contentContainer}>
        <MapboxGL.MapView
        ref={(c) => this._map = c}
        style={{flex: 8}}
        showUserLocation={true}
        zoomEnabled={true}
        >
          <MapboxGL.Camera
            zoomLevel={15}
            centerCoordinate={[this.state.longitude,this.state.latitude]}
          />
          <MapboxGL.UserLocation>    
          </MapboxGL.UserLocation>
        </MapboxGL.MapView>
        <View style={styles.whiteContainer}>

        </View>
        <View style={styles.buttonContainer}>
          <Button 
            TextColor={Color.colors.WHITE_COLOR}
            backgroundColor={Color.colors.PRIMARY_COLOR}
            buttonLabel={'START'}
            onPress={() => this.onStart()}
            />
        </View>
        </View>

      </SafeAreaView>
    );
  }
}

export default Home;