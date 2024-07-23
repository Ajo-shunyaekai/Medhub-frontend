import React, { useState, useEffect } from 'react';
// import styles from './countryDetails.module.css';
import styles from '../style/countryDetails.module.css';

const CountryDetails = ({countryData}) => {
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);

    // Function to fetch country data from the API
    const fetchCountries = async () => {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            const data = await response.json();
            setCountries(data);
        } catch (error) {
            console.error('Error fetching country data:', error);
        }
    };

    // Fetch country data when the component mounts
    useEffect(() => {
        fetchCountries();
    }, []);

    // Filter countries based on countryData prop
    useEffect(() => {
        if (countries.length > 0 && countryData?.length > 0) {
            const filtered = countries.filter(country => countryData.includes(country.name.common));
            setFilteredCountries(filtered);
        }
    }, [countries, countryData]);

    return (
        <>
            <ul className={styles.container}>
                {filteredCountries.map(country => (
                    <li key={country.name.common}>
                        <h6>{country.name.common}</h6>
                        {country.flags && country.flags.svg && (
                            <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} style={{ width: '20px', height: 'auto' }} />
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default CountryDetails;