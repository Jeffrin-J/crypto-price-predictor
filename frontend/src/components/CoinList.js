import React, { useEffect, useState } from 'react'
import { Layout, Table, Typography, Image, Space } from 'antd'
import { API_URL } from "../constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCoin } from '../slices/coin';

const { Content } = Layout;
const { Text } = Typography;


export default function CoinList() {

    const [data, setData] = useState([])
    const [filters, setFilters] = useState([])
    const dispatch = useDispatch();

    const columns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank'
        },
        {
            title: 'Name',
            dataIndex: 'name_list',
            key: 'name_list',
            filters: filters,
            onFilter: (value, record) => record.name_list[0].startsWith(value),
            filterSearch: true,
            render: (value) => (
                <Space size='small'>
                    <Image width={30} src={value[1]}/>
                    <a onClick={() => {dispatch(setCoin(value[2]))}}>{value[0]}</a>
                </Space>
            ),
        },
        {
            title: 'Price (in $)',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: '24h %',
            dataIndex: 'change',
            key: 'change',
            sorter: (a, b) => a.change - b.change,
            render: (value) => {
                if(value>0)
                    return <Text type='success'>{value}%</Text>
                else if(value===0)
                    return <Text>{value}%</Text>
                else
                    return <Text type='danger'>{value}%</Text>
                
            }
        },
    ];

    useEffect(() => {
        axios.get(API_URL+'/retrieveCoinsData').then((res) => {
            setData(res.data['dict'])
            setFilters(res.data['filters'])
        })
        .catch((err)=>{console.log(err)})
    }, [])

    return (
        <Content
            style={{
            padding: '20px 50px',
            }}
            className="coinslist"
        >
            <div className="site-layout-content">
                <Table columns={columns} dataSource={data} pagination={{ pageSize: 7}}/>
            </div>
        </Content>
    )
}
