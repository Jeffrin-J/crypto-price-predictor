import { Content } from 'antd/lib/layout/layout';
import { Col, Image, Row, Space, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { API_URL } from '../constants';
import Chart from 'react-apexcharts'
import BTC from '../output/BTC_plot.png'
import ETH from '../output/ETH_plot.png'
import XRP from '../output/XRP_plot.png'
import DOT from '../output/DOT_plot.png'
import DOGE from '../output/DOGE_plot.png'
import ALGO from '../output/ALGO_plot.png'
import AVAX from '../output/AVAX_plot.png'
import MANA from '../output/MANA_plot.png'
import LTC from '../output/LTC_plot.png'
import MATIC from '../output/MATIC_plot.png'
import SAND from '../output/SAND_plot.png'

export default function CoinDescription() {

    const coin = useSelector((state) => state.coin.value);
    const [data, setData] = useState({})
    const [graphData, setGraphData] = useState([])
    const {Title} = Typography
    const [src, setSrc] = useState()

    useEffect(() => {
        axios.get(API_URL+`/getCoinData/${coin}/`).then(
            (res) => {
                if(res.data.symbol=='BTC')
                {
                    setSrc(BTC)
                }
                else if(res.data.symbol=='ETH'){
                    setSrc(ETH)
                }
                else if(res.data.symbol=='XRP'){
                    setSrc(XRP)
                }
                else if(res.data.symbol=='ALGO'){
                    setSrc(ALGO)
                }
                else if(res.data.symbol=='AVAX'){
                    setSrc(AVAX)
                }
                else if(res.data.symbol=='DOGE'){
                    setSrc(DOGE)
                }
                else if(res.data.symbol=='MATIC'){
                    setSrc(MATIC)
                }
                else if(res.data.symbol=='DOT'){
                    setSrc(DOT)
                }
                else if(res.data.symbol=='LTC'){
                    setSrc(LTC)
                }
                else if(res.data.symbol=='SAND'){
                    setSrc(SAND)
                }
                else if(res.data.symbol=='MANA'){
                    setSrc(MANA)
                }
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
                        {/* <Chart
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
                        /> */}
                        
                        <img src={src} width={600} height={400}/>
                    </Col>
                </Row>
            </div>
        </Content>
    )
}
