import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { TextField, InputAdornment } from '@mui/material';

import { FaChevronDown } from 'react-icons/fa';
import { BsSearch, BsCheckCircle } from 'react-icons/bs'
import './style.scss';
import styled from 'styled-components'

const tokens = ['Avalanche', 'Binance Smart Chain', 'Celo', 'Ethereum', 'Houbi ECO Chain', 'Polygon (Matic)', 'Solana'];
const imgs = ['avalanche.png', 'bsc.png', 'celo.svg', 'ethereum.png', 'houbi.png', 'polygon.png', 'solana.png']

function SimpleDialog(props) {
    const { onClose, selectedValue, open, setToken } = props;
    const [criteria, setCriteria] = useState('');

    const handleClose = () => {
        onClose(selectedValue);
        setCriteria('');
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };


    return (
        <TokenDialog onClose={handleClose} open={open}>
            <div className="dialogtitle">Select a blockchain</div>
            <div style={{ width: "100%", maxHeight: "400px", overflowY: "scroll" }}>
                <div style={{ paddingRight: "25px" }}>
                    <TextField
                        search
                        id="input-with-icon-textfield"
                        InputLabelProps={{ shrink: false }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BsSearch style={{ marginRight: "8px", color: "#b8b5f8" }} />
                                </InputAdornment>
                            ),
                            style: { background: "white", font: "300 18px 'Gilroy-Light'", padding: "10px 25px 10px 19px", border: "1px solid #b8b5f8", borderRadius: "8px" },
                            disableUnderline: true
                        }}
                        style={{ width: "100%" }}
                        variant="standard"
                        placeholder="Search"
                        onChange={(e) => { setCriteria(e.target.value) }}
                    />
                    <List sx={{ pt: "30px" }} >
                        {tokens.map((token, i) => {
                            if (!token.includes(criteria)) return;
                            return <button button onClick={() => handleListItemClick(i)} key={token} className="listitem" style={{ background: i === selectedValue ? "linear-gradient(270deg,#b8b5f838 0,#fff 100%)" : "" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <img src={imgs[i]} width={24} style={{ paddingRight: "16px" }} />
                                        <div className="listitemtext">{token}</div>
                                    </div>
                                    {i === selectedValue && <BsCheckCircle style={{ fontSize: "20px", paddingRight: "20px", color: "#8c86f5" }} />}
                                </div>
                            </button>
                        })}
                    </List>
                </div>
            </div>
        </TokenDialog >
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export default function SimpleDialogDemo({ index, setToken }) {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(index);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
        setToken(tokens[value]);
    };

    return (
        <div>
            <button className="from" onClick={handleClickOpen}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={imgs[selectedValue]} width="24" style={{ marginRight: "12px" }} />
                    <span>{tokens[selectedValue]}</span>
                </div>
                <FaChevronDown />
            </button>
            <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
                setToken={setToken}
            />
        </div>
    );
}

const TokenDialog = styled(Dialog)`
  & .MuiPaper-root {
    padding: 40px 64px 24px;
    border-radius: 16px!important;
    width: 520px;
  }
`;
