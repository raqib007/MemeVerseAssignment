import React from 'react';
import {List, Avatar, Space, Image, Button} from 'antd';
import {MessageOutlined, LikeOutlined, DislikeOutlined, StarOutlined} from '@ant-design/icons';
import '../pages/css/category.css';
import {Link, useHistory} from 'react-router-dom';

export default function Meme(props) {

    const history = useHistory();

    const IconText = ({icon, text}) => (
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
                    key={item.description}
                    actions={[
                        // <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                        <Button onClick={() => props.onUpVoteClick(item)}><IconText icon={LikeOutlined}
                                                                                    text={item.up_vote}
                                                                                    key="list-vertical-like-o"/></Button>,
                        <Button onClick={() => props.onDownVoteClick(item)}><IconText icon={DislikeOutlined}
                                                                                    text={item.down_vote}
                                                                                    key="list-vertical-like-o"/></Button>,
                        <Button onClick={() => history.push(`/comments/${item._id}`)}><IconText icon={MessageOutlined}
                                                                                    text={item.comments.length}
                                                                                    key="list-vertical-message"/></Button>,
                    ]}
                >
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar}/>}
                        title={ <Link to={`/meme/${item._id}`}>{item.user_id.first_name} {item.user_id.last_name}</Link>}
                        description={
                            <>
                                <p>{item.description}</p>
                                <Image
                                    width={200}
                                    src={item.image_url}
                                    placeholder={
                                        <Image
                                            preview={false}
                                            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                                            width={200}
                                        />
                                    }
                                />
                            </>
                        }
                    />

                </List.Item>
            )}
        />
    );
}