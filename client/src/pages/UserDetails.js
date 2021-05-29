import React, { useEffect, useState, useContext } from "react";
import { useParams,Link } from 'react-router-dom';
import { AuthContext } from "../context-provider/userContext";
import { Avatar, Spin, Row, Col, Typography, Space, Button, Divider, Image, message, Modal,List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useFetch from "../custom-hooks/useFetch";
import './css/userDetails.css';
const { Title, Text } = Typography;

export default function UserDetails(props) {
    const { id } = useParams()
    const [userProfile, setProfile] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setmodalTitle] = useState('Show Followers List');
    const [modalData, setmodalData] = useState([]);
    const { state } = useContext(AuthContext)
    const [showfollow, setShowFollow] = useState(state ? !state.following.includes(id) : true)
    const { get, post } = useFetch(process.env.REACT_APP_BASE_URL);
    const auth = useContext(AuthContext);

    useEffect(() => {
        get(`users/${id}`)
            .then(result => {
                if (auth.user !== null) {
                    const alreadyFollower = result.followers.filter(f => f._id === auth.user.userId);
                    if (alreadyFollower.length > 0) {
                        setShowFollow(false)
                    }
                }
                setProfile(result);
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    function handleModal(val, title, data) {
        var o = 1;
        var o_s = "1";
        console.log(o == o_s);
        console.log(o === o_s);
        
        setModalVisible(val);
        setmodalTitle(title);
        setmodalData(data);
    }

    const followUser = () => {
        if (auth.user !== null) {
            post(`users/${id}/follow-user`, {}
            ).then(data => {
                if (data.success) {
                    setProfile((prevState) => {
                        const newFollower = {
                            _id: auth.user.userId,
                            email: auth.user.email,
                            first_name: auth.user.first_name,
                            last_name: auth.user.last_name
                        }
                        return {
                            ...prevState,
                            followers: [...prevState.followers, newFollower]
                        }
                    })
                    setShowFollow(false)
                } else {
                    message.warning(data.message);
                }
            }).catch(error => {
                console.log(error);
                message.warning(error);
            })
        } else {
            props.onShowModal(true, 'signin', 'Sign In');
        }
    }

    const unfollowUser = () => {
        if (auth.user !== null) {
            post(`users/${id}/unfollow-user`, {}
            ).then(data => {
                if (data.success) {
                    setProfile((prevState) => {
                        const newFollower = prevState.followers.filter(item => item._id != auth.user.userId);
                        return {
                            ...prevState,
                            followers: newFollower
                        }
                    })
                    setShowFollow(true);
                } else {
                    message.warning(data.message);
                }
                // dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })


            })
                .catch(error => {
                    console.log(error);
                    message.warn('error', error);
                })
        } else {
            props.onShowModal(true, 'signin', 'Sign In');
        }
    }

    return (
        <>
            {userProfile ?
                <div style={{ maxWidth: "550px", margin: "0px auto", border: "0px solid red", padding: "10px 24px" }}>
                    <Row gutter={20}>
                        <Col span={4}>
                            <Avatar
                                style={{
                                    backgroundColor: '#00a2ae',
                                    verticalAlign: 'middle',
                                }}
                                size={64}
                            >
                                {userProfile.first_name}
                            </Avatar>
                        </Col>
                        <Col span={20}>
                            <Space direction="vertical">
                                <Title level={3} style={{ marginBottom: "0" }}>{userProfile.first_name} {userProfile.last_name}</Title>
                                <Text type="secondary">{userProfile.email}</Text>
                                <div className="following-btn">
                                    <h4>{userProfile.posts.length} posts</h4>
                                    <h4 onClick={() => handleModal(true, 'Show Followers List',userProfile.followers)}>{userProfile.followers.length} followers</h4>
                                    <h4 onClick={() => handleModal(true, 'Show Followering User List',userProfile.following)}>{userProfile.following.length} following</h4>
                                </div>

                                {showfollow ?
                                    <Button onClick={() => followUser()} icon={<PlusOutlined />} >Follow</Button>
                                    :
                                    <Button onClick={() => unfollowUser()}>Unfollow</Button>
                                }
                            </Space>
                        </Col>
                    </Row>
                    <Divider />
                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <Image
                                        key={item._id}
                                        src={item.image_url}
                                        alt={item.description}
                                        placeholder={
                                            <Image
                                                preview={false}
                                                src={item.image_url}
                                                className="responsive-img"
                                            />
                                        }
                                    />
                                )
                            })
                        }
                    </div>
                </div>


                :
                <div className="example">
                    <Spin />
                </div>
            }

            <Modal
                title={modalTitle}
                centered
                visible={modalVisible}
                onOk={() => handleModal(false, '', [])}
                onCancel={() => handleModal(false, '', [])}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={modalData}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar style={{backgroundColor: '#00a2ae',verticalAlign: 'middle'}}size={45}>{item?.first_name}</Avatar>}
                                // title={<Link to={`/meme_user/${item?._id}`}>{item?.first_name} {item?.last_name}</Link>}
                                title={<a href="#">{item?.first_name} {item?.last_name}</a>}
                            />
                        </List.Item>
                    )}
                />,
            </Modal>

        </>
    )
}