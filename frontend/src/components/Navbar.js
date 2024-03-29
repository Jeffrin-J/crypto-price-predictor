import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useDispatch } from "react-redux";
import { setActive } from '../slices/active';
import { setCoin } from '../slices/coin';
import { useSelector } from "react-redux";

const { Header } = Layout;

export default function Navbar() {

    const [tab, setTab] = useState('coin_list')
    const dispatch = useDispatch();
    const loginStatus = useSelector((state) => state.login.value)

    return (
        <Header style={{float: 'right'}}>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[tab]}
                onClick={(res)=>{setTab(res.key); dispatch(setActive(res.key)); dispatch(setCoin(-1))}}
                items={loginStatus===true?[{
                    key: 'coin_list',
                    label: 'Live price',
                    },
                    {
                    key: 'forum',
                    label: 'Forum',
                    },
                    {
                    key: 'logout',
                    label: 'Logout',
                    }]:[{
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
