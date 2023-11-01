import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StatusBar,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {debounce} from 'lodash'
import {forecastImages, theme} from '../styles';
import {CalendarDaysIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {MapPinIcon} from 'react-native-heroicons/solid';
import { locationData, weatherData } from '../api/weather';
import * as Progress from 'react-native-progress';


export default function HomeScreen() {
  const [showSearch, setToggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeatherData] = useState({});
  const [loading,setLoading] = useState(true);
  
  const dailyForecast = [{day:'Sunday',temp:'22℃'},
                          {day:'Monday',temp:'25℃'},
                          {day:'Tuesday',temp:'21℃'},
                          {day:'Wednesday',temp:'22℃'},
                          {day:'Thursday',temp:'23℃'},
                          {day:'Friday',temp:'23℃'},
                          {day:'Saturday',temp:'20℃'}]


  function handleLocation(loc){
    // console.warn("location" , loc);
    setLocations([]);
    setLoading(true)
    weatherData({city:loc.name,days:'7'})
    .then(res=>{
      // console.warn("got weather data: ",res)
      setWeatherData(res)
      setLoading(false)
    })
    setToggleSearch(false)
  }

  function handleSearch(val){
    if(val.length>2){
      locationData({city:val})
      .then((res)=>{
        setLocations(res)
        // console.warn(locations)
      })
  }
  }


  useEffect(() => {
    fetchDefaultData();
  }, [])
  

  const fetchDefaultData =()=>{
    weatherData({city:'Mumbai',days:'7'})
    .then(res=>{
      setWeatherData(res)
      setLoading(false)
    })
  }


  const {current , location, forecast } = weather;
  console.log(location)
  const handleTextVal = useCallback(debounce(handleSearch,1500),[]);


  return (
    <View className="flex-1 relative">
      {/* <StatusBar style='light' barStyle={'dark-content'}/> */}
      <Image
        blurRadius={15}
        source={require('../assets/images/bg3.png')}
        className="absolute h-full w-full"
      />

    {loading?(
      <View className="flex-1 flex-row justify-center items-center">
        <Progress.CircleSnail color={['yellow','green', 'blue','red']} thickness={5} size={70}/>
      </View>
    ):(

      <SafeAreaView className="flex flex-1">


        <View className="mx-4 relative z-50" style={{height: '7%'}}>
          <View
            className="flex-row justify-end items-center rounded-full"
            style={{
              backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent',
            }}>
            {showSearch ? (
              <TextInput
              onChangeText={handleTextVal}
                placeholder="Search City"
                placeholderTextColor={'lightgray'}
                className="flex-1 pl-8 h-15 text-base text-white"
              />
            ) : null}
            <TouchableOpacity
              onPress={() => setToggleSearch(!showSearch)}
              style={{backgroundColor: theme.bgWhite(0.3)}}
              className="p-3 rounded-full m-1">
              <MagnifyingGlassIcon size="25" color="white" />
            </TouchableOpacity>
          </View>
          <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
            {locations.length > 0 && showSearch
              ? locations.map((loc,index) => {
                  let showBorder = index+1 != locations.length;
                  let borderClass = showBorder
                    ? 'border-b-2 border-b-gray-400'
                    : '';
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={()=>handleLocation(loc)}
                      className={`flex-row items-center border-0 p-3 px-4 mb-1 ${borderClass}`}>
                      <MapPinIcon size={20} color={'gray'} className="p" />
                      <Text>{loc?.name},{loc?.country}</Text>
                    </TouchableOpacity>
                  );
                })
              : null}
          </View>
        </View>


        <View className='mx-4 justify-around flex-1 mb-2'>
          <Text className='text-white text-center text-2xl font-bold'>{location? location.name : "Mumbai"},
            <Text className='text-lg font-semibold text-gray-300'>{location? location.country: "Maharashtra"}</Text>
          </Text>

          <View className='justify-center flex-row'>
            <Image source={forecastImages[current.condition.text]?forecastImages[current.condition.text]:require('../assets/images/sun.png')} className='w-52 h-52'/>
            {/* <Image source={require('../assets/images/sun.png')} className='w-52 h-52'/> */}
          </View>

          <View className='space-y-2'>
            <Text className='text-center font-bold text-white text-6xl ml-5'>
              {current?current.temp_c:"29"}&#176;C
            </Text>
            <Text className='text-center font-bold text-white tracking-widest ml-5'>
                {current?current.condition.text:"Sunny"}
            </Text>
          </View>

          <View className='flex-row justify-between mx-4'>
            <View className='flex-row space-x-2 items-center'>
              <Image source={require('../assets/icons/wind.png')} className='h-6 w-6'/>
              <Text className='text-white font-semibold text-base'>{current?current.wind_kph+" km/h":"22 km/h"}</Text>
            </View>
            <View className='flex-row space-x-2 items-center'>
              <Image source={require('../assets/icons/drop.png')} className='h-6 w-6'/>
              <Text className='text-white font-semibold text-base'>{current?current.humidity+" %":"20 %"}</Text>
            </View>
            <View className='flex-row space-x-2 items-center'>
              <Image source={require('../assets/icons/sun.png')} className='h-6 w-6'/>
              <Text className='text-white font-semibold text-base'>{forecast?forecast.forecastday[0].astro.sunrise:'6:45 AM'}</Text>
            </View>
          </View>

        </View>


        <View className='mb-2 space-y-3'>
          <View className='flex-row items-center mx-5 space-x-2'>
            <CalendarDaysIcon size={22} color={'white'}/>
            <Text className='text-white text-base'>Daily forecast</Text>
          </View>
          <ScrollView 
          horizontal
          contentContainerStyle={{paddingHorizontal:15}}
          showsHorizontalScrollIndicator={false}>
            
            {forecast?.forecastday.map((item,index)=>{
              let week = new Date(item.date)
              let weekName = week.toLocaleString('en-us', {weekday: 'long'}).split(',')[0];
              return(                
            <View key={index} className='flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4' style={{backgroundColor:theme.bgWhite(0.15)}}>
                <Image source={forecastImages[item.day.condition.text]} className='h-12 w-11'/>
                <Text className='text-white'>{weekName}</Text>
                <Text className='text-white text-xl font-semibold'>{item.day.avgtemp_c}&#176;C</Text>
            </View>)
            })
            }
            
          </ScrollView>
        </View>

      </SafeAreaView>
    )}


    </View>
  );
}
