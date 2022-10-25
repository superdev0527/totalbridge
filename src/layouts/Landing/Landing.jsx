import React, { useEffect, useRef, useState, useMemo } from 'react';

import { FaChevronDown } from 'react-icons/fa';
import LandingItem from '../../components/LandingItem/LandingItem';
import TokenDialog from '../../components/TokenDialog/TokenDialog'
import AssetDialog from '../../components/AssetDialog/AssetDialog'
import './style.scss';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';

import {
    getLedgerWallet,
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolletExtensionWallet,
    getSolletWallet,
    getTorusWallet,
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import Navigation from './Navigation';
import { BsInfoCircle, BsArrowRight } from 'react-icons/bs';

require('@solana/wallet-adapter-react-ui/styles.css');

export default function Landing() {
    const [page, setPage] = useState(0);
    const [isconnect, setConnect] = useState(false);
    const [curstep, setCurStep] = useState(1);
    const [from, setFrom] = useState("Solana");
    const [to, setTo] = useState("Binance Smart Chain");
    const [asset, setAsset] = useState("GGG");

    const [amountValue, setAmountValue] = useState(0);
    const [recepient, setRecepient] = useState();
    const [progress, setProgress] = useState(0);
    const [accountEllipse, setAccountEllipsis] = useState("Send");
    const [sendflag, setSendFlag] = useState(0);

    const bpage = useRef(null);
    const rpage = useRef(null);

    const network = WalletAdapterNetwork.Devnet;

    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
    // Only the wallets you configure here will be compiled into your application
    const wallets = useMemo(() => [
        getPhantomWallet(),
        getSlopeWallet(),
        getSolflareWallet(),
        getTorusWallet({
            options: { clientId: 'Get a client ID @ https://developer.tor.us' }
        }),
        getLedgerWallet(),
        getSolletWallet({ network }),
        getSolletExtensionWallet({ network }),
    ], [network]);

    const handleExchange = () => {
        if (!amountValue) {
            alert("Input Correct Amount");
            return;
        }
        if (progress) {
            alert("Please wait processing. Consider your wallet");
            return;
        }
        setAccountEllipsis("Please wait...");
        if (from === "Solana" && to === "Binance Smart Chain") setSendFlag(1);
        if (to === "Solana" && from === "Binance Smart Chain") setSendFlag(2);
    }
    useEffect(() => {
        rpage.current.className = "";
        bpage.current.className = "";
        page ? rpage.current.className = "active" :
            bpage.current.className = "active";
    }, [page])
    return (
        <div className="landing">
            <div className="top">
                <img src="logo.svg" width="auto" height="62px" className="logo" />
                <div className="toolbar">
                    <div ref={bpage} onClick={() => setPage(0)}>Bridge</div>
                    <div ref={rpage} onClick={() => setPage(1)}>Receive</div>
                </div>
            </div>
            <div className="bridgepage" style={{ display: page ? "none" : "" }}>

                <LandingItem title="Choose blockchain and asset" number={1} curstep={curstep} >
                    <div className="main" style={{ display: curstep === 1 ? "" : "none" }}>
                        <div className="detail">
                            From
                            <TokenDialog index={6} setToken={setFrom} />
                        </div>
                        <div className="arrowdown">
                            <span className="circle"><img src="arrowdown.svg" /></span>
                            <span className="shadow" />
                        </div>
                        <div className="detail">
                            To
                            <TokenDialog index={1} setToken={setTo} />
                        </div>
                        <div className="detail">
                            Choose asset
                            <AssetDialog index={2} setAsset={setAsset} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <ConnectionProvider endpoint={endpoint}>
                                <WalletProvider wallets={wallets}>
                                    <WalletModalProvider>
                                        <Navigation setCurStep={setCurStep} setProgress={setProgress} amountValue={amountValue} account={recepient} setAccount={setRecepient} sendflag={sendflag} />
                                    </WalletModalProvider>
                                </WalletProvider>
                            </ConnectionProvider>
                        </div>
                    </div>
                    {curstep > 1 && <div className="main">
                        <div style={{ display: "flex", alignItems: "center" }}><span>From:</span>&nbsp;&nbsp;{from}&nbsp;&nbsp;&nbsp;&nbsp;<BsArrowRight />&nbsp;&nbsp;&nbsp;&nbsp;<span>To:</span>&nbsp;&nbsp;{to}</div>
                        <div style={{ marginTop: "10px" }}><span>Asset:</span>&nbsp;&nbsp;{asset}</div>
                    </div>}
                </LandingItem>

                <LandingItem title={"Amount and address"} number={2} curstep={curstep} >
                    {curstep === 2 && <div className="main">
                        <div style={{ fontSize: "14px" }}>Address to send your assets to</div>
                        <span className="input">
                            <input type="text" value={recepient} />
                        </span>
                        <div className="article">
                            <div><BsInfoCircle />&nbsp;&nbsp;Please send your assets to wallets where you control private keys!</div>
                            <div>
                                <div>Don't send your assets to contract or token addresses, and cryptocurrency exchanges like</div>
                                <div>Binance, Kraken, FTX etc.. There is a chance that your assets will get lost on the exchange side.</div>
                            </div>
                        </div>
                        <div style={{ fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                            <div>Amount Send</div>
                            <div>Current balance: 0 GGG</div>
                        </div>
                        <span className="input">
                            <input type="text" onChange={(event) => setAmountValue(event.target.value / 1)} />
                        </span>
                        <div className="bridgefee">
                            <div>
                                <div>BridgeFee:</div>
                                <div>1 GGG</div>
                            </div>
                            <div>
                                <div>You will Receive:</div>
                                {amountValue == 0 && <div>-</div>}
                                {amountValue != 0 && <div>{amountValue}</div>}
                            </div>
                        </div>
                        <button className="connect" onClick={() => !progress && handleExchange()}>Send</button>
                    </div>
                    }
                </LandingItem>
                <LandingItem title={"Confirmation"} number={3} curstep={curstep} />
                <LandingItem title={"Receive money"} number={4} curstep={curstep} />
            </div>
            <div className="bridgepage" style={{ display: page ? "" : "none" }}>
                <LandingItem title={"Input transaction id"} number={1} active>
                    <div className="main">
                        <div>Transaction ID</div>
                        <div style={{ fontSize: "14px" }}>Transaction ID of the Send transaction. <span style={{ textDecoration: "underline", cursor: "pointer" }}>Here is how to find it.</span></div>
                        <span className="input">
                            <input type="text" />
                        </span>
                        <button className="connect disabled">Connect Wallet</button>
                    </div>
                </LandingItem>
                <LandingItem title={"Receive money"} number={2} />
            </div>
            <div className="fixed">
                <img src="mark.png" width="90px" style={{ borderRadius: "50%", boxShadow: "rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;" }} />
            </div>
        </div>
    );
}

