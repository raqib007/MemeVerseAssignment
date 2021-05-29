import React,{useContext,useEffect,useState} from 'react';
import {List, Avatar, Space, Image, Button, Spin} from 'antd';
import { MessageOutlined} from '@ant-design/icons';
import { Link, useHistory,useParams } from 'react-router-dom';
import './css/category.css';
import './css/meme.css';
import {AuthContext} from "../context-provider/userContext";
import fetch from "../custom-hooks/useFetch";
import MemeButton from "../components/MemeButton";

export default function Meme(props) {
    const history = useHistory();
    const params = useParams();
    const auth = useContext(AuthContext);
    const [memes, setMemes] = useState([]);
    const {get, isLoading} = fetch(process.env.REACT_APP_BASE_URL);

    useEffect(()=>{

        console.log('inside params');
        get(`meme/${params.id ? params.id : 'all'}`)
            .then(response => {
                setMemes(response);
            })
            .catch(error => {
                console.log(error);
            });

    },[params?.id]);

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    return (
        <Spin spinning={isLoading}>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={memes}
                renderItem={(item) => (
                    <List.Item
                        key={item._id}
                        actions={[
                            <MemeButton item={item} singinModal={props.onShowModal} />,
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
                            title={<Link to={`/meme_user/${item.user_id._id}`}>{item.user_id.first_name} {item.user_id.last_name}</Link>}
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
        </Spin>
    );
}