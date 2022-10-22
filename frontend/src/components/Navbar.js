import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useDispatch } from "react-redux";
import { setActive } from '../slices/active';
import { setCoin } from '../slices/coin';

const { Header } = Layout;

export default function Navbar() {

    const [tab, setTab] = useState('coin_list')
    const dispatch = useDispatch();

    return (
        <Header style={{float: 'right'}}>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[tab]}
                onClick={(res)=>{setTab(res.key); dispatch(setActive(res.key)); dispatch(setCoin(''))}}
                items={[{
                    key: 'coin_list',
                    label: 'Live price',
                    },
                    {
                    key: 'forum',
                    label: 'Forum',
                    },
                    {
                    key: 'signup',
                    label: 'Register',
                    },
                    {
                    key: 'signin',
                    label: 'Login',
                    }]}
            />
        </Header>
    )
}
