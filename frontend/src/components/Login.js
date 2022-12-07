import { Layout, Button, Form, Input, Typography, Alert } from 'antd';
import axios from 'axios';
import React, { useState } from 'react'
import { API_URL } from "../constants";
import { useDispatch } from "react-redux";
import { setLogin } from '../slices/login';
import { setActive } from '../slices/active';

const { Content } = Layout;
const { Title } = Typography;

export default function Login() {

    const [alert, setAlert] = useState('')
    const dispatch = useDispatch();

    const onFinish = (values) => {
        axios.post(API_URL+'/login/', values)
        .then((res)=>{
            localStorage.setItem('logged', true)
            localStorage.setItem('user', res['data']['user'])
            dispatch(setLogin(true))
            dispatch(setActive('forum'))
        })
        .catch((err)=>{setAlert('error')})
        console.log('Success:', values);
      };
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    return (
        <Content
            style={{
            padding: '10% 20%',
            }}
            className="forum"
        >
            
            {alert==='error' && <Alert message="Invalid credentials" type="error" />}
            <div className="site-layout-content">
            <Title level={2}>Login</Title>
            <Form
                name="basic"
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 20,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                    offset: 0,
                    span: 24,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                    Submit
                    </Button>
                </Form.Item>
                </Form>
            </div>
        </Content>
    )
}
