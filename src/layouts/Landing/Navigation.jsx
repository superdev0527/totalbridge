import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { FC, useEffect } from 'react';
import * as web3 from "@solana/web3.js";
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';

import BigNumber from 'bignumber.js';
import BridgeBsc from '../../build/contracts/BridgeBsc.json';
import TokenBsc from '../../build/contracts/TokenBsc.json';
import Web3 from 'web3';
import * as splToken from "@solana/spl-token";
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const decimalNumber = new BigNumber("1000000000000000000");
const bscNetworkId = 97;
const feeAmount = 2;

const DEMO_FROM_SECRET_KEY = new Uint8Array([240, 139, 150, 135, 78, 82, 183, 13, 39, 122, 39,
    232, 108, 202, 173, 79, 146, 73, 194, 161, 143, 155, 96, 143, 25, 34, 227, 15, 95, 201, 16, 156,
    51, 218, 186, 57, 4, 207, 199, 40, 247, 30, 87, 198, 149, 45, 110, 234, 40, 210, 46, 0, 246, 92,
    145, 69, 117, 158, 149, 115, 42, 169, 170, 183]);

const Navigation = ({ setCurStep, setProgress, amountValue, account, setAccount, sendflag }) => {

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onSolana = async () => {
        var from = web3.Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
        if (sendflag === 1) {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: from.publicKey,
                    lamports: web3.LAMPORTS_PER_SOL * amountValue,
                })
            );
            const signature = await sendTransaction(transaction, connection).catch((error) => { alert("error"); setProgress(0); return; });
            if (signature) await connection.confirmTransaction(signature, 'processed');
            // console.log(publicKey);
            // console.log(splToken.TOKEN_PROGRAM_ID.toString())
            // var myMint = new web3.PublicKey("4h6C8xSU2gCi7utyus7wCv6J6R4qKZh6y6fG6tJnH58D");
            // var myToken = new splToken.Token(
            //     connection,
            //     myMint,
            //     splToken.TOKEN_PROGRAM_ID,
            //     from
            // );
            // var fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
            //     publicKey
            // )
            // var temp = await myToken.getOrCreateAssociatedAccountInfo(
            //     from.publicKey
            // )
            // console.log(temp.address.toString())
            // const destPublicKey = new web3.PublicKey(from.publicKey);

            // // Get the derived address of the destination wallet which will hold the custom token
            // const associatedDestinationTokenAddr = await splToken.Token.getAssociatedTokenAddress(
            //     myToken.associatedProgramId,
            //     myToken.programId,
            //     myMint,
            //     destPublicKey
            // );

            // const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr);

            // console.log(fromTokenAccount.address.toString());
            // console.log(associatedDestinationTokenAddr.toString());

            // var transaction = await new Transaction()
            //     .add(
            //         splToken.Token.createTransferInstruction(
            //             splToken.TOKEN_PROGRAM_ID,
            //             associatedDestinationTokenAddr,
            //             fromTokenAccount.address,
            //             from.publicKey,
            //             [from],
            //             amountValue
            //         )
            //     );
            // transaction.feePayer = publicKey;
            // transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
            // // const signature = await sendTransaction(transaction, connection);
            // // if (signature) await connection.confirmTransaction(signature, 'processed');
            // const transactionSignature = await connection.sendRawTransaction(
            //     transaction.serialize(),
            //     { skipPreflight: true }
            // );
            // if (transactionSignature) await connection.confirmTransaction(transactionSignature);
            console.log("SIGNATURE", signature);
            console.log("SUCCESS");
        }
        if (sendflag == 2) {
            var transaction = new web3.Transaction().add(
                web3.SystemProgram.transfer({
                    fromPubkey: from.publicKey,
                    toPubkey: publicKey,
                    lamports: web3.LAMPORTS_PER_SOL * amountValue,
                })
            );
            // Sign transaction, broadcast, and confirm
            var signature = await web3.sendAndConfirmTransaction(
                connection,
                transaction,
                [from]
            );
        }
    }
    const onBridgeBsc = async () => {

        const amount = new BigNumber(amountValue).multipliedBy(decimalNumber).toJSON();
        const amountToApprove = (new BigNumber(amountValue).plus(feeAmount)).multipliedBy(decimalNumber).toJSON();

        const nonce = 1;
        const bridgeBscAddress = BridgeBsc.networks[bscNetworkId].address;
        const message = window.web3.utils.soliditySha3(
            { t: 'address', v: account },
            { t: 'address', v: account },
            { t: 'uint256', v: amount },
            { t: 'uint256', v: nonce },
        ).toString('hex');

        const signature = message;
        const tokenBscInstance = new window.web3.eth.Contract(TokenBsc.abi, TokenBsc.networks[bscNetworkId].address);
        const bridgeBscInstance = new window.web3.eth.Contract(BridgeBsc.abi, bridgeBscAddress);
        console.log(amount);
        console.log(account);
        if (sendflag === 1) {
            await bridgeBscInstance.methods.mint(bridgeBscAddress, account, amount, nonce, signature).send({ from: account });
        }
        if (sendflag === 2) {
            // await tokenBscInstance.methods.setAutomatedMarketMakerPair(bridgeBscAddress, false).send({ from: account })
            // await tokenBscInstance.methods.setAllowedTransfer(bridgeBscAddress, true).send({from : account});
            await tokenBscInstance.methods.approve(account, amountToApprove).send({ from: account });
            await tokenBscInstance.methods.transferFrom(account, bridgeBscAddress, amount).send({ from: account });
        }
    }

    useEffect(async () => {
        if (publicKey) {
            setCurStep(2);
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
                const accounts = await window.web3.eth.getAccounts();
                setAccount(accounts[0]);

            }
        }
    }, [publicKey])

    useEffect(async () => {
        if (sendflag === 1) {
            const chainId = await window.web3.eth.getChainId();
            if (chainId !== 97) {
                alert("Wrong Network");
                setProgress(0);
                return;
            }
            setProgress(1);
            await onSolana();
            await onBridgeBsc();
            alert("Finished");
            setProgress(0);
        }
        if (sendflag === 2) {
            const chainId = await window.web3.eth.getChainId();
            if (chainId !== 97) {
                alert("Wrong Network");
                setProgress(0);
                return;
            }
            setProgress(1)
            await onBridgeBsc();
            await onSolana();
            alert("Finished");
            setProgress(0);
        }
    }, [sendflag])
    return (
        <div>
            <WalletMultiButton />
        </div>
    );
};
export default Navigation;