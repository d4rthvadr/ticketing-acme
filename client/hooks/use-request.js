import { useState } from 'react';
import axios from 'axios';

export default ({ url, method, body = {}, onSuccess }) => {
    const [errors, setErrors] = useState([]);

    const doRequest = async () => {
        try {

            setErrors([]);
            const response = await axios[method](url, body);

            if (onSuccess) {
                onSuccess(response.data);
            }

            return response.data;

        } catch (err) {
            setErrors(err.response.data.errors || 'An error occurred');
        }
    };

    return { doRequest, errors };
};


