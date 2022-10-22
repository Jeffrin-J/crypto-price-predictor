import React from 'react'
import { useSelector } from "react-redux";

export default function CoinDescription() {

    const coin = useSelector((state) => state.coin.value);

    return (
        <div>{coin}</div>
    )
}
