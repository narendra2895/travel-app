import React, { useEffect, useState } from 'react'
import { CssBaseline, Grid } from '@material-ui/core'
import Header from './components/Header/Header.jsx'
import List from './components/List/List.jsx'
import Map from './components/Map/Map.jsx'

import { getPlacesData } from './api/index.js';


const App = () => {

    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] =useState([]);
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const [bounds, setBounds] = useState({  });
    const [childClicked, setChildClicked] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType]= useState('restaurants');
    const [rating, setRating]= useState('');


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoordinates({ lat: latitude, lng: longitude })
        })
    }, []);

    useEffect(() => {
        setIsLoading(true)
        getPlacesData(type, bounds.ne, bounds.sw)
            .then((data) => {
                console.log(data);
                setPlaces(data);
                setFilteredPlaces([]);
                setIsLoading(false);
            })
    }, [type, coordinates, bounds]);

    useEffect(()=>{
        const filteredPlaces = places.filter((place) => place.rating > rating);

        setFilteredPlaces(filteredPlaces)
    },[rating])

    return (
        <>
            <CssBaseline />
            <Header  setCoordinates={setCoordinates} />
            <Grid container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={12} md={4}>
                    <List places={filteredPlaces.length ?filteredPlaces :places} childClicked={childClicked} isLoading={isLoading}  type={type} setType={setType} rating={rating}  setRating={setRating} />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map setCoordinates={setCoordinates} setBounds={setBounds} coordinates={coordinates}  places={filteredPlaces.length ?filteredPlaces :places} setChildClicked={setChildClicked} />
                </Grid>
            </Grid>
        </>
    )
}

export default App