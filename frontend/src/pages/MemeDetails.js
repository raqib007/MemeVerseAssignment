import React,{useEffect, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {Avatar, Button, Image, Row, Space, Tag, Form, Input, Comment, Col, Divider, Skeleton} from "antd";
import {DislikeOutlined, LikeOutlined, UserOutlined} from "@ant-design/icons";
import useFetch from '../custom-hooks/useFetch';

export default function MemeDetails(props) {
    const params = useParams();
    const history = useHistory();
    const {get, isLoading} = useFetch('http://localhost:3000/api/');
    const [meme, setMeme] = useState({});

    const { TextArea } = Input;
    useEffect(()=>{
        get(`meme/${params.id}`)
            .then(response=>{
                console.log(response);
                setMeme(response);
            })
            .catch(error=>{
                console.log(error);
            });
    },[]);

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
            <Skeleton avatar paragraph={{ rows: 12 }} loading={isLoading} active>
            <div><Avatar size="small" shape="square" icon={<UserOutlined/>}/> Funny - 1h</div>
            <h2>{meme?.description}</h2>
            <p>{meme?.comments?.length} Comments</p>
            <div>
                <Button onClick={() => props.onUpVoteClick()} style={{marginRight: 10}}>
                    <IconText icon={LikeOutlined}
                    // text={item.up_vote}
                    key="list-vertical-like-o"/> &nbsp;{meme.up_vote}
                </Button>
                <Button onClick={() => props.onDownVoteClick()}>
                    <IconText icon={DislikeOutlined}
                        // text={item.down_vote}
                    key="list-vertical-like-o"/> &nbsp;{meme.down_vote}
                </Button>
            </div>
            <div style={{marginTop:10}}>
                <Image
                    width={'100%'}
                    src={meme.image_url}
                    placeholder={
                        <Image
                            preview={false}
                            src={`${meme.image_url}?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200`}
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
                {
                    meme.comments && meme.comments.map(comment=>{
                        return (<Row key={comment._id} style={{marginTop:2}}>
                            <Col span={2}>
                                <Avatar size="large" icon={<UserOutlined />} />
                            </Col>
                            <Col span={22}>
                                <h4 style={{margin:0}}>{comment.user_id}</h4>
                                <p>{comment.comment}</p>
                            </Col>
                        </Row>)
                    })
                }

            </div>
            </Skeleton>
        </div>
    )
}