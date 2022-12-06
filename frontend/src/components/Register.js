import { Layout, Button, Form, Input, Typography, Alert } from 'antd';
import axios from 'axios';
import React, { useState } from 'react'
import { API_URL } from "../constants";

const { Content } = Layout;
const { Title } = Typography;

export default function Register() {

    const [alert, setAlert] = useState('')


    const onFinish = (values) => {
        axios.post(API_URL+'/registerUser/', values)
        .then((res)=>{
            if(res.status === 201){
                setAlert('success')
            }
            else{
                setAlert('error')
            }
        })
        .catch((err)=>{console.log(err)})
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
            
            {alert==='error' && <Alert message="Username already taken or email invalid" type="error" />}
            {alert==='success' && <Alert message="Registeration Successful" type="success" />}
            <div className="site-layout-content">
            <Title level={2}>Register Yourself</Title>
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
                    label="Email"
                    name="email"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your email',
                    },
                    {
                        pattern: new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
                        message: "Invalid email"
                    }
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
