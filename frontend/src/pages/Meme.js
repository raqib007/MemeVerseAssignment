import React,{useContext} from 'react';
import { List, Avatar, Space, Image, Button } from 'antd';
import { MessageOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import './css/category.css';
import {AuthContext} from "../context-provider/userContext";

export default function Meme(props) {
    const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
    const history = useHistory();
    const auth = useContext(AuthContext);

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    return (
        <List
            itemLayout="vertical"
            size="large"
            dataSource={props.memes}
            renderItem={item => (
                <List.Item
                    key={item._id}
                    actions={[
                        <Button onClick={() => auth.user !== null ? props.onUpVoteClick(item) : props.onShowModal(true,'signin','Sign In')}><IconText icon={LikeOutlined}
                            text={item.up_vote}
                            key="list-vertical-like-o" /></Button>,
                        <Button onClick={() => auth.user !== null ? props.onDownVoteClick(item) : props.onShowModal(true,'signin', 'Sign In')}><IconText icon={DislikeOutlined}
                            text={item.down_vote}
                            key="list-vertical-like-o" /></Button>,
                        <Button onClick={() => history.push(`/comments/${item._id}`)}><IconText icon={MessageOutlined}
                            text={item.comments.length}
                            key="list-vertical-message" /></Button>,
                    ]}
                >
                    <List.Item.Meta
                        avatar={<Avatar
                            style={{
                                backgroundColor: '#00a2ae',
                                verticalAlign: 'middle',
                            }}
                            size="large"
                        >
                            {item.user_id.first_name}
                        </Avatar>}
                        title={<Link to={`/meme_user/${item._id}`}>{item.user_id.first_name} {item.user_id.last_name}</Link>}
                        description={
                            <>
                                <p>{item.description}</p>
                                <Link to={`/details/${item._id}`}><Image
                                    src={item.image_url}
                                    placeholder={
                                        <Image
                                            preview={false}
                                            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                                            className="responsive-img"
                                        />
                                    }
                                    preview={false}
                                /></Link>
                            </>
                        }
                    />

                </List.Item>
            )}
        />
    );
}