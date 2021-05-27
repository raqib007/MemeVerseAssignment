import React from 'react';
import {Form, Input, Checkbox, Button} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';

export default function Signin(props){

    const onFinish = (values) => {
        props.onSigninClick(values);
    };

    const handleCreateAccount = (e) => {
        e.preventDefault();
        props.onAccountClick(true,'signup');
    }

    return(
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{remember: true}}
            onFinish={onFinish}
        >
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
                <a className="login-form-forgot" href="/#">
                    Forgot password?
                </a>

                <a className="login-form-signup" href="" onClick={(e)=> handleCreateAccount(e)}>
                    Need an account?
                </a>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={props.isLoading} className="login-form-button" block>
                    Sign in
                </Button>
            </Form.Item>
        </Form>
    );
}