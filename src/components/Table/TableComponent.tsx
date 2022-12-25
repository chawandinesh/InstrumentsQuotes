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
import {makeStyles} from '@mui/styles'
import _ from "lodash";

interface ITableAction {
    name: string,
    label: string, 
    title: string, 
    icon: React.ReactElement
}


interface ITableComponent {
    data: any[];
    columns: {label: string,name: string, items?:ITableAction[],onClick?:(value:any) => void, render?:(value:any) => JSX.Element }[];
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
    rowsPerPageOptions?: number[],
    start?: number,
    end?:number
}

const useStyles = makeStyles({
 clickable: {
  cursor:'pointer'
 }
});


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
  total,
  handleRowsPerPage = (value) => {},
  handlePage = (value) => {},
  page=0,
  rowsPerPageOptions=[5, 10, 25],
  start=0,
  end=5
}) => {
  const classes = useStyles()
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
            _.map(data.filter((each,idx) => idx >= start && idx < end ), (eachData, idxData) => (
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
                      <TableCell key={idxCol} className={eachCol?.onClick ? classes.clickable : undefined} onClick={() => eachCol?.onClick ?  eachCol.onClick(_.get(eachData, eachCol.name, "")) : {}}>
                        {
                          eachCol?.render ?
                            eachCol?.render(_.get(eachData, eachCol.name, ""))
                          :
                          _.get(eachData, eachCol.name, "")
                        }
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
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={total || _.size(data)}
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
