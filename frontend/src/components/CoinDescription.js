import { Content } from 'antd/lib/layout/layout';
import { Col, Image, Row, Space, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { API_URL } from '../constants';
import Chart from 'react-apexcharts'

export default function CoinDescription() {

    const coin = useSelector((state) => state.coin.value);
    const [data, setData] = useState({})
    const [graphData, setGraphData] = useState([])
    const {Title} = Typography

    useEffect(() => {
        axios.get(API_URL+`/getCoinData/${coin}/`).then(
            (res) => {
                setData(res.data)
                axios.get(API_URL+`/getOHLCData/${res.data['uuid']}/`).then(
                    (response) => {
                        var arr = response.data

                        arr.forEach((elm, ind) => {
                            arr[ind]['x'] = new Date(arr[ind]['x'])
                        });

                        setGraphData(arr)
                        console.log(arr)
                    }
                ).catch((err) => console.log(err))
            } 
        ).catch((err) => {console.log(err)})
    }, [coin])
       

    return (
        <Content
            style={{
            padding: '20px 150px',
            }}
            className="coinDescription"
        >
            <div className="site-layout-content">
                <Row>
                    <Col span={24} style={{display: 'flex', alignItems: 'center'}}>
                    <Space size='small'>
                        <Image width={90} src={data.iconUrl}/>
                        <Title style={{paddingTop: '15px'}} level={1}>{data.name}</Title>
                    </Space>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Space direction='vertical' size='large'>
                            <Row>
                                <Col span={10} style={{textAlign:'left'}}>
                                    <Title level={5}>Name</Title>
                                </Col>
                                <Col span={14} style={{textAlign:'left'}}>
                                    <Typography>{data.name}</Typography>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10} style={{textAlign:'left'}}>
                                    <Title level={5}>Symbol</Title>
                                </Col>
                                <Col span={14} style={{textAlign:'left'}}>
                                    <Typography>{data.symbol}</Typography>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10} style={{textAlign:'left'}}>
                                    <Title level={5}>Rank (Market Cap)</Title>
                                </Col>
                                <Col span={14} style={{textAlign:'left'}}>
                                    <Typography>{data.rank}</Typography>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10} style={{textAlign:'left'}}>
                                    <Title level={5}>Market Cap</Title>
                                </Col>
                                <Col span={14} style={{textAlign:'left'}}>
                                    <Typography>${data.marketCap}</Typography>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10} style={{textAlign:'left'}}>
                                    <Title level={5}>Price</Title>
                                </Col>
                                <Col span={14} style={{textAlign:'left'}}>
                                    <Typography>${data.price}</Typography>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10} style={{textAlign:'left'}}>
                                    <Title level={5}>Change (24h)</Title>
                                </Col>
                                <Col span={14} style={{textAlign:'left'}}>
                                    <Typography>${data.change}</Typography>
                                </Col>
                            </Row>
                        </Space>
                        
                    </Col>
                    <Col span={12}>
                        <Chart
                        series={[{data: graphData}]}
                        options={{
                            chart: {
                              type: 'candlestick',
                              height: 350
                            },
                            title: {
                              text: `${data.name} OHLC`,
                              align: 'left'
                            },
                            xaxis: {
                              type: 'datetime'
                            },
                            yaxis: {
                              tooltip: {
                                enabled: true
                              }
                            }
                          }}
                          type="candlestick" 
                          height={350}
                        />
                    </Col>
                </Row>
            </div>
        </Content>
    )
}
