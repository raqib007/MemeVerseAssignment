import React, {useState, useEffect} from "react";
import {Upload, message, Button, Form, Row, Col, Input, Select} from 'antd';
import {InboxOutlined, UploadOutlined, MessageOutlined} from '@ant-design/icons';
import useFetch from "../custom-hooks/useFetch";

export default function FileUpload(props) {
    const [form, setForm] = useState(false);
    const [category, setCategory] = useState([]);
    const {get, isLoading} = useFetch('http://localhost:3000/api/');
    const [imageInfo,setImageInfo] = useState({});
    const CLOUD_NAME  = 'ddgllfems';
    const UPLOAD_PRESET  = 'czaobowo';

    useEffect(() => {
        get('category')
            .then(response => {
                setCategory(response);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    const prop = {
        name: 'file',
        action: `https://api.Cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data:{
            upload_preset : UPLOAD_PRESET
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file.response);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };


    const onFinish = (values) => {
        console.log(values);
    };

    const handleUploadClick = (e) => {
        e.preventDefault();

    }

    return (

        <Form
            name="normal_login"
            className="login-form"
            initialValues={{remember: true}}
            onFinish={onFinish}
        >
            <Form.Item>
                <Upload {...prop} maxCount={1} listType="picture">
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
            </Form.Item>
            <Form.Item
                style={{marginTop: 20}}
                name="description"
                rules={[{required: true, message: 'Description is required!'}]}
            >
                <Input prefix={<MessageOutlined className="site-form-item-icon"/>}
                       placeholder="Description"/>
            </Form.Item>
            <Form.Item
                name="category"
                rules={[{required: true, message: 'Category is required!'}]}
            >
                <Select
                    placeholder="Select a Category"
                    // onChange={onGenderChange}
                    loading={isLoading}
                    allowClear
                >
                    {category.map(cat => (<Select.Option value={cat._id}>{cat.name}</Select.Option>))}

                </Select>
            </Form.Item>

            <Form.Item style={{float: "right"}}>
                <Button type="primary" htmlType="submit" loading={props?.isLoading}
                        className="login-form-button">
                    Save
                </Button>
            </Form.Item>
        </Form>

    );
}