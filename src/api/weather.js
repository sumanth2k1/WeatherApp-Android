import { View, Text } from 'react-native'
import React from 'react'
import axios from 'axios';


const apikey = '3531bc1c7f6e4c27b8392956233110';
const firstEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${params.city}&days=${params.days}&aqi=no&alerts=no`;

const locationEndpoint = params => `https://api.weatherapi.com/v1/search.json?key=${apikey}&q=${params.city}`;



const apiCall = async(endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    }
    try{
        const response = await axios.request(options,{headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }});
        // console.warn(response.data)
        return response.data;
    }catch(err){
        console.warn(err)
        return null
    }
}


export const weatherData = (params) => {
    apiCall(firstEndpoint(params))
}

export const locationData = (params) => {
    apiCall(locationEndpoint(params))
}