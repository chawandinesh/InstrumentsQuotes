/**
 * This file contains all api endpoints
 */

import axios from "axios";

const baseUrl_v2 = "https://prototype.sbulltech.com/api/v2";



const getInstruments = () =>
  axios({
    method: "GET",
    url: `${baseUrl_v2}/instruments`,
  })

const getQuotes = (symbol: string) =>
  axios.get(`${baseUrl_v2}/quotes/${symbol}`);


export const API = {
    getInstruments,
    getQuotes
}