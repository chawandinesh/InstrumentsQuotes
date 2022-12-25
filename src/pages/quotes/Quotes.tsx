/**
 * Quotes Page
 */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import axios from "axios";
import _, { min } from "lodash";
import { Layout } from "../../components/layouts";
import { TableComponent } from "../../components/Table";
import { SOMETHING_WENT_WRONG } from "../../constants";
import moment from "moment";

let interval: number;

export interface IQuotes {
  price: number;
  time: string;
  valid_till: string;
}

/**
 * returns the formatted date jsx
 */
const FormatDate: React.FC<{
  date: string;
  danger?: boolean;
  data?: IQuotes[];
}> = ({ date, danger, data }) => {
  const minDate = _.size(data)
    ? _.map(data, (eachData) => moment(_.get(eachData, "valid_till", "")))
    : [];
  return (
    <Typography
      fontWeight={moment(moment.min(minDate)).diff(date) === 0 ? 700 : 500} //highlighting the latest expiring entity
      color={danger ? "red" : ""}
      variant="body2"
    >
      {moment(date).format("Do MMM YYYY, HH:mm:ss")}
    </Typography>
  );
};

/**
 * Quotes Component
 * @returns jsx
 */
const Quotes = () => {
  const params = useParams();
  const symbol = _.get(params, "symbol", "");
  //api states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [data, setData] = useState<IQuotes[]>([]);
  //table
  const [sortKey, setSortKey] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | boolean>("asc");

  /**
   * @function @name fetchQuotesByInstrumentSymbol
   * @description FetchQuotes by instrument symbol
   */
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

  /**
   * @function @name reloadPageIfTimeExpires
   * @description Here is the logic to reload the page on expiration of valid_till time based on current time
   */
  const reloadPageIfTimeExpires = () => {
    interval = setInterval(() => {
      const allTimes = _.size(data)
        ? _.map(data, (eachData) => moment(_.get(eachData, "valid_till", "")))
        : [];
      const utcTime = moment.utc().format("YYYY-MM-DD HH:mm:ss")
      const minTime = moment.min(allTimes); //minimum time, latest in all expirations
      const utcOfMinTime = minTime.format("YYYY-MM-DD HH:mm:ss")
      const isExpires =moment(utcTime,"YYYY-MM-DD HH:mm:ss").isAfter(moment(utcOfMinTime,"YYYY-MM-DD HH:mm:ss"))
      if(isExpires){
        clearInterval(interval)
        window.location.reload()
      }
    
    }, 5000);
  };

  /**
   * useEffect Hook for keep track of page reload on expiration after every 5 seconds
   */
  useEffect(() => {
    if (_.size(data)) {
      reloadPageIfTimeExpires();
    }
    return () => {
      clearInterval(interval);
    };
  }, [data]);

  /**
   * call getQuotes api on mounting
   */
  useEffect(() => {
    if (symbol) {
      fetchQuotesByInstrumentSymbol();
    }
  }, [symbol]);

  /**
   * Columns for the quotes table
   */
  const columns = [
    {
      label: "Price",
      name: "price",
      render: (price: number) => (
        <Typography variant="body2" color="Highlight">
          {price.toFixed(2)}
        </Typography>
      ),
    },
    {
      label: "Time",
      name: "time",
      render: (date: string) => <FormatDate date={date} />,
    },
    {
      label: "Valid Till",
      name: "valid_till",
      sortable: true,
      createSortHandler: (key: string, order: "asc" | "desc" | boolean) => {
        setSortKey(key);
        setSortOrder(order);
        const sortByValidTill: IQuotes[] = _.orderBy(
          data,
          (eachData: IQuotes) => {
            return moment(eachData.valid_till).format();
          },
          [order]
        );
        setData(sortByValidTill);
      },
      render: (date: string) => <FormatDate danger date={date} data={data} />,
    },
  ];

  /**
   * return jsx
   */
  return (
    <Layout>
      <>
        <Stack direction="row" spacing={1} mb={2}>
          <Typography variant="h6" fontWeight={700}>
            Quotes:
          </Typography>
          <Typography variant="h6" fontWeight={700} color="Highlight">
            {symbol}
          </Typography>
        </Stack>
        <TableComponent
          sortKey={sortKey}
          sortOrder={sortOrder}
          loading={loading}
          errorText={errorText}
          noDataText="No Quotes Available"
          error={error}
          columns={columns}
          data={data}
        />
      </>
    </Layout>
  );
};

export default Quotes;
