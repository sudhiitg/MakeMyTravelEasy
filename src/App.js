import React,{useState, useEffect} from 'react';

import {CssBaseline , Grid} from '@material-ui/core';


import Header from './components/Header/Header';
import Map from './components/Map/Map';
import List from './components/List/List';

import {getPlacesData, getWeatherData} from './api/index'



const App = ()=>{

    const [childClicked, setChildClicked] = useState(null)

    const [filteredPlaces, setFilteredPlaces] =  useState([])
    const[places, setPlaces] = useState([]);
    const[coords, setCoords]= useState();
    const[bounds, setBounds]= useState({});
    const[weatherData, setWeatherData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [type,setType] = useState('restaurants');
    const [rating,setRating] = useState('');


    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(({coords:{latitude, longitude}})=>{
            setCoords({lat:latitude, lng:longitude});
        })
    },[]);

    useEffect(()=>{
        const filteredPlaces = places.filter((place)=>place.rating>rating)
        setFilteredPlaces(filteredPlaces);
    },[rating])

useEffect(()=>{
    if(bounds.sw && bounds.ne){
    setIsLoading(true);

        getWeatherData(coords.lat, coords.lng).then((data)=>{
            setWeatherData(data);
        })

    getPlacesData(type,bounds.sw, bounds.ne).then((data)=>{
        setPlaces(data?.filter((place)=> place.name && place.num_reviews >0));
        setFilteredPlaces([]);
        setIsLoading(false);
    })
}
},[type,bounds]);

    return (
        <>
            <CssBaseline />
            <Header setCoords={setCoords} />
            <Grid container spacing={3} style={{width: '100%'}}>
                <Grid item xs={12} md={4}>
                    <List 
                    places={filteredPlaces.length? filteredPlaces: places} 
                    childClicked={childClicked}
                    isLoading={isLoading}
                    type={type}
                    setType={setType}
                    rating={rating}
                    setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map 
                        setCoords={setCoords}
                        setBounds={setBounds}
                        coords={coords}
                        places={filteredPlaces.length? filteredPlaces: places}
                        setChildClicked={setChildClicked}
                        weatherData={weatherData}
                     />
                </Grid>
            </Grid>
        </>
    )
}

export default App;
