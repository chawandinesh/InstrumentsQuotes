import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
  TablePagination,
} from "@mui/material";
import _ from "lodash";

interface ITableAction {
    name: string,
    label: string, 
    title: string, 
    icon: React.ReactElement
}


interface ITableComponent {
    data: any[];
    columns: {label: string,name: string, items?:ITableAction[] }[];
    error?: boolean;
    errorText?: string;
    loading?: boolean;
    noDataText?: string;
    actions?: ITableAction[];
    onClickActionIcon?: (title: string,data:any) => void;
    pagination?: boolean;
    limit?:number;
    total?: number;
    page?: number;
    handleRowsPerPage?:(value: number) => void;
    handlePage?: (value: number) => void,
    onClickCell?: (value:string) => void
}

const TableComponent: React.FC<ITableComponent> = ({
  data,
  columns,
  error,
  errorText,
  loading,
  noDataText,
  onClickActionIcon = (title: string,data: any) => {},
  pagination = false,
  limit = 0,
  total = 5,
  handleRowsPerPage = (value) => {},
  handlePage = (value) => {},
  page=0,
  onClickCell = (value:string) => {}
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {_.map(columns, ({ label, name }, idx) => (
              <TableCell style={{ fontWeight: 600 }} key={idx}>
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={_.size(columns)}
                align="center"
                style={{ verticalAlign: "top" }}
              >
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableCell
              colSpan={3}
              align="center"
              style={{ verticalAlign: "top" }}
            >
              <Typography variant="h6" gutterBottom>
                {errorText}
              </Typography>
            </TableCell>
          ) : !_.size(data) ? (
            <TableRow>
              <TableCell
                colSpan={3}
                align="center"
                style={{ verticalAlign: "top" }}
              >
                <Typography variant="h6" gutterBottom>
                  {noDataText}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            _.map(data, (eachData, idxData) => (
              <TableRow
                key={idxData}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {columns.map((eachCol, idxCol) => (
                  <React.Fragment key={idxCol}>
                    {eachCol.items ? (
                      <TableCell>
                        {_.map(eachCol.items, (each,idx) => (
                          <React.Fragment key={idx}>
                            {each.icon ? (
                              <Tooltip title={each.title} key={each.title}>
                                <IconButton onClick={() => onClickActionIcon(each.title,eachData)}>
                                  {each.icon}
                                </IconButton>
                              </Tooltip>
                            ) : null}
                          </React.Fragment>
                        ))}
                      </TableCell>
                    ) : (
                      <TableCell key={idxCol} onClick={() => onClickCell(eachData)}>
                        {_.get(eachData, eachCol.name, "")}
                      </TableCell>
                    )}
                  </React.Fragment>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {
        pagination ?
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={limit}
            page={page}
            onRowsPerPageChange={(event) => handleRowsPerPage(parseInt(event.target.value))}
            onPageChange={(event,page) => handlePage(page)}
          />
        :null
      }
    </TableContainer>
  );
};

export default TableComponent;
