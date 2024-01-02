// hooks/useFetchData.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3 });

export function useFetchDataWithUrlKey(dataKey) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Ensure we're in the client
        if (typeof window !== 'undefined') {
            const apiKey = window.location.pathname.split('/').pop() || '';
            const apiUrl = `/api/fetch?datakey=${encodeURIComponent(dataKey)}&apikey=${encodeURIComponent(apiKey)}`;

            const fetchData = async () => {
                try {
                    const res = await axios.get(apiUrl);
                    const data = res.data;

                    if (!data || Object.keys(data).length === 0) {
                        // If data is an empty object, retry after 1 second
                        setTimeout(fetchData, 1000);
                    } else {
                        setData(data);
                        setLoading(false);
                    }
                } catch (error) {
                    setError(error.message);
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [dataKey]);

    return { data, loading, error };
}


export function useFetchData(dataKey) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiUrl = `/api/fetch?datakey=${encodeURIComponent(dataKey)}`;

        const fetchData = async () => {
            try {
                const res = await axios.get(apiUrl);
                const data = res.data;

                if (!data || Object.keys(data).length === 0) {
                    // If data is an empty object, retry after 1 second
                    setTimeout(fetchData, 1000);
                } else {
                    setData(data);
                    setLoading(false);
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [dataKey]); // Re-run the effect when `dataKey` changes

    return { data, loading, error };
}