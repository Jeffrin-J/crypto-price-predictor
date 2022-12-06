import React from 'react'
import { Layout, Typography, Row, Col, Avatar, Input, Button, Space} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

const { Content } = Layout;
const { Title } = Typography;

export default function Forum(props) {

  const loginStatus = useSelector((state) => state.login.value)

  return (
    <Content
        style={{
        padding: '20px 50px',
        }}
        className="forum"
    >
        <div className="site-layout-content">
          {props['tweets'].map((tweet, i) => {
          return (<div className='thread' key={i}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Row>
              <Col span={4}><Avatar
                icon={<UserOutlined />}
                style={{
                  color: '#f56a00',
                  backgroundColor: '#fde3cf',
                }}
              >
                U
              </Avatar></Col>
              <Col span={20} style={{textAlign: "left"}}>
                <Title level={4}>{tweet['name']}</Title>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={4} style={{textAlign: "left"}}>
                {tweet['text']}
              </Col>
            </Row>
            {loginStatus===true && 
            <Row>
              <Col span={20} offset={4}>
                <Input.Group compact>
                  <Input style={{ width: 'calc(100% - 100px)' }} placeholder="Share your thoughts...." />
                  <Button type="primary">Send</Button>
                </Input.Group>
              </Col>
            </Row>
            }
            
            </Space>
          </div>)})}
            
        </div>
    </Content>
  )
}
