import React, { Component } from 'react';
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
//packages
import { moderateScale } from 'react-native-size-matters';
import Toast from 'react-native-simple-toast';
import { showMessage, hideMessage } from "react-native-flash-message";
import MapboxGL from "@react-native-mapbox-gl/maps";
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import { Stopwatch } from 'react-native-stopwatch-timer';
import moment from 'moment/src/moment';
import {trackData} from '../../Action/track';
import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import { map, filter } from "rxjs/operators";
//Components and Styles
import { Button } from '../../components/Button'
import measures from '../../utils/measures';
import styles from './styles';
import Color from '../../utils/color';
import { Logo, CircleTick } from '../../utils/svg'
import GpsHeader from '../../components/GpsHeader'
import Header from '../../components/Header'
import GpsNotice from '../../components/GpsNotice'
import { connect } from 'react-redux';

MapboxGL.setAccessToken("sk.eyJ1IjoiYXNoYXJ5ayIsImEiOiJjazlkd3V4M2EwN2F2M210OW14YThhYmZ2In0.R3YGEmDFk_xphmFf3Gq8Jg");


var payload = {}

class Tracking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      hasPermission: true,
      distance: 0.0,
      isTimerStart: false,
      timer: "",
      startTime: "",
      endTime: "",
      date: "",
      selectScreen:''
    }
    this.back = false;
    this.time = '';
    this.lastCoordinates=[]
    this.coordinatesArray=[]

  };

  //to draw polyline
  drawPolyLine(index) {
    const route = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [this.coordinatesArray[index - 1][1], this.coordinatesArray[index - 1][0]],
              [this.coordinatesArray[index][1], this.coordinatesArray[index][0]],
            ],
          },
          style: {
            fill: 'red',
            strokeWidth: '4',
            fillOpacity: 0.6,
          },
          paint: {
            'fill-color': '#088',
            'fill-opacity': 0.8,
          },
        },
      ],
    }
    const shapeId = "line" + index;
    const lineId = "linelayer" + index;
    return (
      <MapboxGL.ShapeSource id={shapeId} shape={route}>

        <MapboxGL.LineLayer id={lineId} style={{
          lineColor: 'red',
          lineWidth: 3,
          lineCap: 'round',
        }} />

      </MapboxGL.ShapeSource>
    );
  }


  renderPolyLine() {
    let items = [];

    for (let i = 1; i < this.coordinatesArray.length; i++) {
      items.push(this.drawPolyLine(i));
    }

    return items;
  }

  componentDidMount() {
    console.log("selected screen",this.state.selectScreen);
    MapboxGL.setTelemetryEnabled(false);
    this.onTracking();
    this.setState({ isTimerStart: true, startTime: moment(new Date).format('HH:mm'), date: moment(new Date).format('DD/MM/YYYY'), latitude: this.props.route.params.latitude, longitude: this.props.route.params.longitude })
    this.coordinatesArray = [];
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.log("redux values==",nextProps, prevState);
    
  //   return null;
  // }

  componentWillUnmount() {
    this.coordinatesArray = [];
  }

  //function for total distance calcuation

  calculateDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = this.deg2rad(lat1);
      var radlat2 = this.deg2rad(lat2);
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      return dist;
    }
  }

  deg2rad=(deg)=> {
    return deg * (Math.PI/180)
  }


  //function for tracking
  onTracking() {

    let distance = 0.0;

    Geolocation.watchPosition(

      position => {
        console.log(
          'ontracking watchpositon',
          position,
          this.lastCoordinates,
        );

        distance = distance + this.calculateDistance(this.lastCoordinates.length > 0 ? this.lastCoordinates[0] : position.coords.latitude, this.lastCoordinates.length > 0 ? this.lastCoordinates[1] : position.coords.longitude, position.coords.latitude, position.coords.longitude)
        this.lastCoordinates = [position.coords.latitude, position.coords.longitude]
        const tempLocation = [position.coords.latitude, position.coords.longitude]
        this.coordinatesArray.push(tempLocation)
        this.setState({ hasPermission: true, distance: distance.toFixed(2), longitude: position.coords.longitude, latitude: position.coords.latitude })

      }),
      error => {
        this.setStat({ hasPermission: false })

      },
    {
      enableHighAccuracy: true,
      interval: 10000,
      distanceFilter: 10
    }
  }






  setCounterTime(time) {
    this.time = time
  };


  goBack = () => {
    this.props.navigation.goBack();
  }
  //finish tracking
  onFinish = () => {

    Geolocation.stopObserving();
    this.setState({ timer: this.time,selectScreen : "Activity", isTimerStart: false, endTime: moment(new Date).format('HH:mm') })
  }

  stopCounting = () => {
    this.props.navigation.goBack();
  }

  Close = () => {
    this.setState({
     selectScreen : ""
    },()=>{
      this.props.navigation.goBack();
    })
    
  }

  //activity is sored in store 
   saveActivity = () => {
    let {timer,startTime,endTime,date,distance} = this.state ;
     payload = {
        coordinates: this.coordinatesArray,
        time: timer,
        start_time: startTime,
        end_time: endTime,
        date: date,
        distance: distance
    }
    this.props.saveActivity(payload)
    this.setState({
      selectScreen:"Finish"
    })
  }
  render() {
    console.disableYellowBox = true;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle="dark-content" />
        {this.state.selectScreen == "Activity" &&
          <View style={{ position: 'absolute', height: measures.ScreenHeight, width: measures.ScreenWidth, zIndex: 10, backgroundColor: 'red' }}>
            <Header onPress={() => { this.Close() }} />
            <View style={{
              height: moderateScale(100),
              width: '100%',
              backgroundColor: Color.colors.PRIMARY_COLOR,
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingHorizontal: moderateScale(10)
            }}>
              <Text style={styles.activityHeaderText}>
                Archie's Ride
            </Text>
              <Text style={styles.dateTimeText}>
                {`${this.state.date} @ ${this.state.startTime} until @ ${this.state.endTime}`}
              </Text>
            </View>
            <View style={styles.contentContainer}>

              <MapboxGL.MapView
                ref={(c) => this._map = c}

                style={{ flex: 2 }}
                showUserLocation={true}
                zoomEnabled={true}
              >
                <MapboxGL.Camera
                  zoomLevel={14}
                  centerCoordinate={[this.state.longitude, this.state.latitude]}
                />
                <MapboxGL.UserLocation>
                </MapboxGL.UserLocation>
                {this.renderPolyLine()}
              </MapboxGL.MapView>
              <View style={[styles.sectionContainer, { flex: .5 }]}>
                <View style={styles.subContainer}>
                  <Text style={styles.commonText}>
                    Time
                  </Text>

                  <Text style={styles.FooterText}>
                    {this.state.timer}
                  </Text>
                </View>
                <View style={styles.subContainer}>
                  <Text style={styles.commonText}>
                    Distance (MI)
            </Text>
                  <Text style={styles.FooterText}>
                    {this.state.distance}
                  </Text>
                </View>

              </View>
              <View style={styles.whiteContainer}>
                <Button
                  buttonType={"full"}
                  TextColor={Color.colors.WHITE_COLOR}
                  backgroundColor={Color.colors.PRIMARY_COLOR}
                  buttonLabel={'SAVE ACTIVITY'}
                  onPress={() => this.saveActivity()}
                />
              </View>

            </View>
          </View>
        }
        {this.state.selectScreen == "Finish" &&
          <View style={{ position: 'absolute', height: measures.ScreenHeight, width: measures.ScreenWidth, zIndex: 10, backgroundColor: 'red' }}>
            <Header onPress={() => { this.Close() }} />

            <View style={[styles.contentContainer, { justifyContent: 'center', paddingHorizontal: moderateScale(15), alignItems: 'center' }]}>
              <CircleTick />
              <Text style={styles.FooterText}>
                Activity Saved
            </Text>
              <Text style={[styles.commonText, { textAlign: 'center', fontSize: moderateScale(14) }]}
                numberOfLines={2}

              >
                {`Your activity has been saved and can be viewed in the activity tab`}
              </Text>


            </View>
          </View>
        }
         {/* tracking screen */}
         {this.state.selectScreen == "" &&
        <View style={{flex:1}}> 
        <Header Label={'Back'} onPress={() => { this.goBack() }} />
        {this.state.hasPermission ?
        <GpsNotice Label={ 'GPS SIGNAL ACQUIRED'} backgroundColor={ '#28B463' } />
        :null}
        <View style={styles.contentContainer}>
          <MapboxGL.MapView
            ref={(c) => this._map = c}
            style={{ flex: 8 }}
            showUserLocation={true}
            zoomEnabled={true}
          >
            <MapboxGL.Camera
              zoomLevel={15}
              centerCoordinate={[this.state.longitude, this.state.latitude]}
            />
            <MapboxGL.UserLocation>
            </MapboxGL.UserLocation>
          </MapboxGL.MapView>
          <View style={styles.sectionContainer}>
            <View style={styles.subContainer}>
              <Text style={styles.commonText}>
                Time
            </Text>
              <Stopwatch
                start={this.state.isTimerStart}
                //totalDuration={90000}
                options={{

                  text: styles.FooterText
                }}
                // handleFinish={(time)=>this.handleFinish(time)}
                getTime={(time) => this.setCounterTime(time)} />
              {/* <Text style={styles.FooterText}>
              {this.state.timer}
            </Text> */}
            </View>
            <View style={styles.subContainer}>
              <Text style={styles.commonText}>
                Distance (MI)
            </Text>
              <Text style={styles.FooterText}>
                {this.state.distance}
              </Text>
            </View>

          </View>
          <View style={styles.whiteContainer}>

          </View>
          <View style={styles.buttonContainer}>
            <Button
              buttonType={"round"}
              TextColor={Color.colors.PRIMARY_COLOR}
              backgroundColor={Color.colors.WHITE_COLOR}
              buttonLabel={'STOP'}
              onPress={() => this.stopCounting()}
            />
            <Button
              buttonType={"round"}
              TextColor={Color.colors.WHITE_COLOR}
              backgroundColor={Color.colors.PRIMARY_COLOR}
              buttonLabel={'FINISH'}
              onPress={() => this.onFinish()}
            />
          </View>
        </View>
        </View>
        }
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  TrackDetails : state.track.TrackDetails
});

const mapDispatchToProps = dispatch => ({
  saveActivity:(payload)=>dispatch(trackData(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tracking);