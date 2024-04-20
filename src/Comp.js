import React, { useEffect, useState } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.info.main,
        fontWeight: 700,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: "#E1EBEE",
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


export default function Comp() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("https://canopy-frontend-task.vercel.app/api/holdings");
            if (!res.ok) {
                console.log("error");
                throw new Error("Network response was not ok");
            }
            const jsonData = await res.json();
            setData(jsonData.payload);
            console.log(jsonData.payload);
            console.log(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const groupBy = (array, key) => {
        return array.reduce((result, currentItem) => {
            (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
            return result;
        }, {});
    };
    const groupedData = groupBy(data, 'asset_class');

    const [expanded, setExpanded] = useState([false, false]);
    const handleAccordionChange = (index) => {
        setExpanded(prevExpanded => {
            const newExpanded = [...prevExpanded];
            newExpanded[index] = !newExpanded[index];
            return newExpanded;
        });
    };


    return (
        <div style={{ padding: "2rem" }}>
            <div>
                {Object.keys(groupedData).map((groupKey, index) => (
                    <div key={groupKey} style={{ margin: "0.5rem 0" }}>
                        <Accordion expanded={expanded[index]} onChange={() => handleAccordionChange(index)}>
                            <AccordionSummary
                                aria-controls={groupKey}
                                id={groupKey}
                                style={{
                                    flexDirection: 'row-reverse',
                                }}
                                expandIcon={<ExpandMoreIcon style={expanded[index] ? { backgroundColor: "#6050DC", color: "white", borderRadius: "1rem" } : { backgroundColor: "lightgrey", borderRadius: "1rem" }} />}
                            >
                                <Typography style={{ fontSize: "1.2rem", margin: "0.6rem 1rem", color: "#034694", fontWeight: 600 }}>{groupKey} ({groupedData[groupKey].length})</Typography>
                            </AccordionSummary>
                            <AccordionDetails id={groupKey}>
                                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead >
                                                <TableRow >
                                                    <StyledTableCell>Name of the holding</StyledTableCell>
                                                    <StyledTableCell>Ticker</StyledTableCell>
                                                    <StyledTableCell>Average Price</StyledTableCell>
                                                    <StyledTableCell>Market Price</StyledTableCell>
                                                    <StyledTableCell>Latest change percentage</StyledTableCell>
                                                    <StyledTableCell>Market value in base CCY</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {groupedData[groupKey].map((item) => (
                                                    <StyledTableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <StyledTableCell>{item.name}</StyledTableCell>
                                                        <StyledTableCell>{item.ticker}</StyledTableCell>
                                                        <StyledTableCell>{item.avg_price}</StyledTableCell>
                                                        <StyledTableCell>{item.market_price}</StyledTableCell>
                                                        <StyledTableCell style={ (item.latest_chg_pct<0) ? { color: "red" } : {color: "black" }}>{item.latest_chg_pct}</StyledTableCell>
                                                        <StyledTableCell>{item.market_value_ccy}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                ))}
            </div>
        </div >
    );
}
