import { useEffect, useState } from "react";
import _ from "lodash";
import { CircularProgress, Container, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API } from "../../api";
import { Layout } from "../../components/layouts";
import { TableComponent } from "../../components/Table";
import { NO_INSTRUMENTS, SOMETHING_WENT_WRONG } from "../../constants";
import { helpers } from "../../helpers";
import Typography from "@mui/material/Typography";
import moment from "moment";

const Instruments = () => {
  const navigate = useNavigate();
  /**
   * state variables
   */
  //For api
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  //For table pagination
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const handlePage = (pageValue: number) => {
    setPage(pageValue);
  };

  const handleRowsPerPage = (pageRows: number) => {
    setLimit(pageRows);
  };

  const fetchInstruments = async () => {
    setLoading(true);
    try {
      const { data } = await API.getInstruments();
      setLoading(false);
      setError(false);
      const parsedInstruments = JSON.parse(helpers.csvToJson(data));
      if (_.size(parsedInstruments)) {
        setData(parsedInstruments);
      }
    } catch (err) {
      setLoading(false);
      setError(true);
      setErrorText(SOMETHING_WENT_WRONG);
    }
  };

  useEffect(() => {
    fetchInstruments();
  }, []);

  const handleClickSymbol = (symbol: string) => navigate(`/quotes/${symbol}`);

  const tableColumns = [
    {
      label: "Symbol",
      name: "Symbol",
      onClick: (data: any) => handleClickSymbol(data),
    },
    { label: "Name", name: "Name" },
    { label: "Category", name: "Sector" },
    {
      label: "Valid Till",
      name: "Validtill",
      render: (data: any) =>
        data ? (
          <Typography variant="subtitle2">
            {moment(data).format("Do MMM YYYY,  h:mm A")}
          </Typography>
        ) : (
          <></>
        ),
    },
  ];

  return (
    <Layout>
      <Container>
        <Box p={2}>
          <TableComponent
            page={page}
            loading={loading}
            error={error}
            errorText={NO_INSTRUMENTS}
            limit={limit}
            handlePage={handlePage}
            handleRowsPerPage={handleRowsPerPage}
            pagination={true}
            columns={tableColumns}
            start={page * limit}
            end={limit + page * limit}
            data={data}
          />
        </Box>
      </Container>
    </Layout>
  );
};

export default Instruments;
