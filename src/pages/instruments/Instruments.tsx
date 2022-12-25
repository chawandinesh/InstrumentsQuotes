/**
 * Instruments Page
 */
import { useEffect, useState } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { API } from "../../api";
import { Layout } from "../../components/layouts";
import { TableComponent } from "../../components/Table";
import { NO_INSTRUMENTS, SOMETHING_WENT_WRONG } from "../../constants";
import { helpers } from "../../helpers";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { Grid, Stack, TextField } from "@mui/material";
import { AppLoader } from "../../components/app-loader";
import Fuse from "fuse.js"
export interface IInstruments {
  Name: string;
  Sector: string;
  Symbol: string;
  Validtill: string;
}

/**
 * Instruments component
 */
const Instruments: React.FC = () => {
  //for api
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IInstruments[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  //For table pagination
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  //search
  const [search, setSearch] = useState<string>("");
  const [filteredData, setFilteredData] = useState<IInstruments[]>(data)

  /**
   * @function @name handlePage
   * @description calls when page changes
   * @param {number} pageValue
   */
  const handlePage = (pageValue: number) => {
    setPage(pageValue);
  };

  /**
   * @function @name handleRowsPerPage
   * @description calls number of rows changes
   * @param {number} pageRows
   */
  const handleRowsPerPage = (pageRows: number) => {
    setLimit(pageRows);
  };

  /**
   * @function @name fetchInstruments
   * @description api to fetch instruments
   */
  const fetchInstruments = async () => {
    setLoading(true);
    try {
      const { data } = await API.getInstruments();
      setLoading(false);
      setError(false);
      const parsedInstruments = JSON.parse(helpers.csvToJson(data)); //converting csv file into json on getting response
      if (_.size(parsedInstruments)) {
        setData(parsedInstruments);
        setFilteredData(parsedInstruments)
      }
    } catch (err) {
      setLoading(false);
      setError(true);
      setErrorText(SOMETHING_WENT_WRONG);
    }
  };

  const fuse = new Fuse(data, {
    keys: ['Symbol', 'Name']
  })

  //input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const getFilteredInstruments =  fuse.search(e.target.value)
    const extractedInstruments = getFilteredInstruments.map(each => each.item)
    if(e.target.value){
      setFilteredData(extractedInstruments)
    }else{
      setFilteredData(data)
    }
  }

  /**
   * useEffect hook to call fetch api on initial mount
   */
  useEffect(() => {
    fetchInstruments();
    return () => {
      setLoading(false);
    };
  }, []);

  /**
   * columns for instruments table
   */
  const tableColumns = [
    {
      label: "Symbol",
      name: "Symbol",
      render: (data: string) => (
        <Link to={`/quotes/${data}`}>
          <Typography variant="subtitle2" color="Highlight" fontWeight="700">
            {data}
          </Typography>
        </Link>
      ),
    },
    { label: "Name", name: "Name" },
    { label: "Category", name: "Sector" },
    {
      label: "Valid Till",
      name: "Validtill",
      render: (data: string) =>
        data ? (
          <Typography variant="subtitle2">
            {moment(data).format("Do MMM YYYY,  HH:mm")}
          </Typography>
        ) : (
          <></>
        ),
    },
  ];

  if (loading) return <AppLoader />;

  /**
   * returns jsx
   */
  return (
    <Layout>
      <>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h6" mb={2} fontWeight={700}>
              Instruments
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              onChange={handleChange}
              size="small"
              fullWidth
              placeholder="search"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <TableComponent
          page={page}
          loading={loading}
          error={error}
          noDataText={NO_INSTRUMENTS}
          errorText={errorText}
          limit={limit}
          handlePage={handlePage}
          handleRowsPerPage={handleRowsPerPage}
          pagination={true}
          columns={tableColumns}
          start={page * limit}
          end={limit + page * limit}
          data={filteredData}
        />
      </>
    </Layout>
  );
};

export default Instruments;
