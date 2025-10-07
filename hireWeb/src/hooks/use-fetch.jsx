import { useSession } from '@clerk/clerk-react';
import React from 'react'
import { useState } from 'react';

const useFetch = (cb, options = {}) => {

    const [data, setdata] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, seterror] = useState(null);


    const { session } = useSession();

    const fn = async (...args) => {
        setLoading(true);
        seterror(null);

        try {
            const supabaseAccessTocken = await session.getToken({
                template: 'supabase'
            });

            const response = await cb(supabaseAccessTocken, options, ...args);
            setdata(response);
            seterror(null);
        } catch (error) {
            seterror(error);
        } finally {
            setLoading(false);
        }
    };
    return { fn, data, loading, error };
};

export default useFetch;