import axios from 'axios';

const loadBalancerName = "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local";

export default ({ req } = {}) => {

  if (typeof window === 'undefined') {
    // on the server
    return axios.create({
      baseURL: loadBalancerName,
      headers: req?.headers
    });

  } else {
    // client
    return axios.create({
      baseURL: '/'
    });
  }

}