import buildClient from "../build-client";

export const getCurrentUser = async (context) => {
    const client = buildClient(context);
    const endpoint = "/api/users/currentuser";
    return client.get(endpoint).catch((err) => {
      console.log("err: ", err);  
    });

}
