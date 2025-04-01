import { useState } from "react";
import axios from "axios";

const normalizeError = (error, status) => {
  if (status === 422 || status === 400) {
    const errMessage =
      error?.response?.data?.errors ||
      error?.response?.data?.message ||
      "An error occurred";
    return [errMessage];
  }

  const errMessage = error?.response?.data?.message || "An error occurred";
  return [errMessage];
};

export default ({ url, method, body = {}, onSuccess, onError }) => {
  const [errors, setErrors] = useState([]);

  const doRequest = async (props = { body: {} }) => {
    let response;
    try {
      setErrors([]);
      response = await axios[method](url, { ...body, ...props.body });

      onSuccess?.(response.data);

      return response.data;
    } catch (err) {
      console.log("peek error", err);
      const normalizedErr = normalizeError(err, err?.response?.status);
      onError?.(normalizedErr.pop());
      setErrors(normalizedErr);
    }
  };

  return { doRequest, errors };
};
