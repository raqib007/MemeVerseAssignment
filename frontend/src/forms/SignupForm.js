import React from 'react';
import {Form, Input, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";

export default function Signup(props){
    const onFinish = (values) => {
        props.onSignupClick(values);
    };

    const handleSigninClick = (e) => {
        e.preventDefault();
        props.onSigninClick(true,'signin');
    }

    return(
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{remember: true}}
            onFinish={onFinish}
        >
            <Form.Item>
                <Row gutter={8} >
                    <Col span={12}>
                        <Form.Item
                            name="first_name" noStyle
                            rules={[{required: true, message: 'First Name is required!'}]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="First Name"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="last_name" noStyle
                            rules={[{required: true, message: 'Last Name is required!'}]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Last Name"/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item
                name="email"
                rules={[{required: true, message: 'Email is required!'}]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Email"/>
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{required: true, message: 'Password is required!'}]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon"/>}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={props?.isLoading} className="login-form-button" block>
                    Sign up
                </Button>
            </Form.Item>

            <Form.Item>
                <span>Have an account? </span>
                <a className="" href="/#" onClick={(e)=>handleSigninClick(e)}>
                     Login Here
                </a>
            </Form.Item>
        </Form>
    );
}