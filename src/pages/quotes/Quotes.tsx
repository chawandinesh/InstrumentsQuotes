import { Grid, Paper, Typography,TextField } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { makeStyles } from "@mui/styles";
import { Box, Container, Stack } from "@mui/system";
import axios from "axios";
import _ from "lodash";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../components/layouts";
import { TableComponent } from "../../components/Table";
import { SOMETHING_WENT_WRONG } from "../../constants";
import moment from 'moment'
const Quotes = () => {
  const params = useParams();
  const symbol = _.get(params, "symbol", "");
  //api states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [data, setData] = useState([]);

  const fetchQuotesByInstrumentSymbol = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://prototype.sbulltech.com/api/v2/quotes/${symbol}`
      );
      setLoading(false);
      setError(false);
      setErrorText("");
      setData(_.get(data, `payload[${symbol}]`));
    } catch (err) {
      setLoading(false);
      setError(true);
      setErrorText(SOMETHING_WENT_WRONG);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchQuotesByInstrumentSymbol();
    }
  }, [symbol]);


  return (
    <Layout>
      <Container>
        <Box p={3}>
          <Stack direction="row" spacing={1} mb={2}>
          <Typography variant="h6" fontWeight={700}>Quotes:</Typography>
          <Typography variant="h6" fontWeight={700} color="Highlight">{symbol}</Typography>
          </Stack>
      
        </Box>
      </Container>
    </Layout>
  );
};

export default Quotes;
