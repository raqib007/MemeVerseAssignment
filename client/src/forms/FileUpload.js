import React, {useState, useEffect} from "react";
import {Upload, message, Button, Form, Input, Select, Image} from 'antd';
import {UploadOutlined, MessageOutlined} from '@ant-design/icons';
import useFetch from "../custom-hooks/useFetch";
import {useHistory} from 'react-router-dom';

export default function FileUpload(props) {
    const [category, setCategory] = useState([]);
    const {get, post, isLoading} = useFetch(process.env.REACT_APP_BASE_URL);
    const [uploadProgress, setProgress] = useState(false);
    const [imageInfo, setImageInfo] = useState({});
    const history = useHistory();
    const [form] = Form.useForm();

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
        action: process.env.REACT_APP_CLOUDINARY_URL,
        data: {
            upload_preset: process.env.REACT_APP_UPLOAD_PRESET
        },
        beforeUpload: file => {
            let status = true;
            console.log('file.type = ',file.type);
            if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/gif' && file.type !== 'image/jpeg') {
                message.error(`${file.name} is not a png/jpg/gif file`);
                status = false;
            }
            return status  ? true : Upload.LIST_IGNORE;
        },
        onChange(info) {
            if (info.file.status === 'uploading') {
                setProgress(true);
            }
            if (info.file.status !== 'uploading') {
                console.log(info.file.response);
                setImageInfo(Object.assign({}, {
                    image_url: info.file.response.secure_url,
                    image_public_id: info.file.response.public_id,
                }))
            }
            if (info.file.status === 'done') {
                setProgress(false);
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                setProgress(false);
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };


    const onFinish = (values) => {
        const memeData = Object.assign({}, values, imageInfo,{likes:[],unlikes:[],user_id:props.user});
        console.log(memeData);
        if (!memeData?.image_url) {
            message.error('Meme image is required');
        } else {
            console.log(memeData);

            post('meme', memeData)
                .then(response => {
                    if(response?.status !== false){
                        setImageInfo({});
                        form.resetFields();
                        props.modalStatus(false,'','');
                        history.push("/");
                    }
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                })
        }

    };

    const handleUploadClick = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            {imageInfo?.image_url && (<Image
                width={300}
                src={imageInfo?.image_url}
                placeholder={
                    <Image
                        preview={false}
                        src="https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                        width={300}
                    />
                }

            />)}

            <Form
                name="normal_login"
                className="login-form"
                onFinish={onFinish}
                form={form}
            >
                <Form.Item>
                    <Upload {...prop} multiple={false} maxCount={1} showUploadList={false} >
                        <Button icon={<UploadOutlined/>} loading={uploadProgress}>Click to Upload</Button>
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
                        {category.map(cat => (<Select.Option key={cat._id} value={cat._id}>{cat.name}</Select.Option>))}

                    </Select>
                </Form.Item>

                <Form.Item style={{float: "right"}}>
                    <Button type="primary" htmlType="submit" loading={isLoading}
                            className="login-form-button">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}