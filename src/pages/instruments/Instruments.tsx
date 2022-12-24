import { CircularProgress, Container } from "@mui/material";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { API } from "../../api";
import { Header } from "../../components/layouts";
import { TableComponent } from "../../components/Table";
import { NO_INSTRUMENTS, SOMETHING_WENT_WRONG } from "../../constants";
import { helpers } from "../../helpers";
const Instruments = () => {

  const [loading,setLoading] = useState<boolean>(false);
  const [data,setData] = useState<any[]>([]);
  const [error,setError] = useState<boolean>(false);
  const [errorText,setErrorText] = useState<string>("");


  const fetchInstruments = async() => {
    setLoading(true)
    try{
     const {data} = await API.getInstruments()
     setLoading(false)
     setError(false)
     const parsedInstruments = JSON.parse(helpers.csvToJson(data))
     if(_.size(parsedInstruments)){
        setData(parsedInstruments)
     }
    }catch(err){
        setLoading(false)
        setError(true)
        setErrorText(SOMETHING_WENT_WRONG)
    }
  }

  useEffect(() => {
   fetchInstruments()
  }, [])

  
  if(loading) return <CircularProgress/>
  if(error) return <p>{errorText}</p>
  if(!_.size(data)) return <p>{NO_INSTRUMENTS}</p>
  return (
    <>
      <Header />
      <Container>
        <TableComponent
          columns={[
            { label: "Symbol", name: "Symbol" },
            { label: "Name", name: "Name" },
            { label: "Sector", name: "Sector" },
            { label: "Valid Till", name: "Validtill" },
          ]}
          onClickCell={(value) => {
            8
          }}
          data={data}
        />
      </Container>
    </>
  );
};

export default Instruments;
