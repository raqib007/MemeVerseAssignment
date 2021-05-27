import React from 'react';
import {useParams} from 'react-router-dom';
import {Avatar, Button, Image, Row, Space, Tag, Form, Input, Comment, Col, Divider} from "antd";
import {DislikeOutlined, LikeOutlined, UserOutlined} from "@ant-design/icons";

export default function MemeDetails(props) {
    const params = useParams();
    const { TextArea } = Input;

    const IconText = ({icon, text}) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    const Editor = ({ onChange, onSubmit, submitting, value }) => (
        <>
            <Form.Item>
                <TextArea rows={4} onChange={onChange} value={value} />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                    Add Comment
                </Button>
            </Form.Item>
        </>
    );

    const handleSubmit = () => {
        console.log('submit comment')
    };

    const handleChange = e => {
        console.log(e.target.value);
    };

    return (
        <div>
            <div><Avatar size="small" shape="square" icon={<UserOutlined/>}/> Funny - 1h</div>
            <h2>Title</h2>
            <p>19 Comments</p>
            <div>
                <Button onClick={() => props.onUpVoteClick()} style={{marginRight: 10}}>
                    <IconText icon={LikeOutlined}
                    // text={item.up_vote}
                    key="list-vertical-like-o"/> &nbsp;6
                </Button>
                <Button onClick={() => props.onDownVoteClick()}>
                    <IconText icon={DislikeOutlined}
                        // text={item.down_vote}
                    key="list-vertical-like-o"/> &nbsp;3
                </Button>
            </div>
            <div style={{marginTop:10}}>
                <Image
                    width={'100%'}
                    src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`}
                    placeholder={
                        <Image
                            preview={false}
                            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                            width={200}
                        />
                    }
                />
            </div>
            <div>
                <Tag color="magenta">funny</Tag>
            </div>
            <Divider/>
            <div>
                <Comment
                    content={
                        <Editor
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            submitting={false}
                            value={''}
                        />
                    }
                />
            </div>
            <div>
                <Row style={{marginTop:2}}>
                    <Col span={2}>
                        <Avatar size="large" icon={<UserOutlined />} />
                    </Col>
                    <Col span={22}>
                        <p style={{margin:0}}>User</p>
                        <p>comment</p>
                    </Col>
                </Row>
                <Row style={{marginTop:2}}>
                    <Col span={2}>
                        <Avatar size="large" icon={<UserOutlined />} />
                    </Col>
                    <Col span={22}>
                        <p style={{margin:0}}>User</p>
                        <p>comment</p>
                    </Col>
                </Row>
                <Row style={{marginTop:2}}>
                    <Col span={2}>
                        <Avatar size="large" icon={<UserOutlined />} />
                    </Col>
                    <Col span={22}>
                        <p style={{margin:0}}>User</p>
                        <p>comment</p>
                    </Col>
                </Row>
            </div>
        </div>
    )
}