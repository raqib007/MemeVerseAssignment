import React from 'react';
import {Form, Input, Button,Alert } from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';

export default function Signin(props){
    const onFinish = (values) => {
        props.onSigninClick(values);
    };

    const handleCreateAccount = (e) => {
        e.preventDefault();
        props.onAccountClick(true,'signup','Sign Up');
    }

    return(
        <div>
            {props.errorMsg && <Alert message={props.errorMsg} type="error" showIcon style={{marginBottom:20}}/>}
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{remember: true}}
                onFinish={onFinish}
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid Email!',
                        },
                        {
                            required: true,
                            message: 'Please input your Email!',
                        },
                    ]}
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

                    <a className="login-form-signup" href="/#" onClick={(e)=> handleCreateAccount(e)}>
                        Need an account?
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={props.isLoading} className="login-form-button" block>
                        Sign in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}