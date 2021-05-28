import React, { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { AuthContext } from "../context-provider/userContext";
import {Avatar, Spin, Row, Col, Typography, Space, Button, Divider, Image,message} from 'antd';
import useFetch from "../custom-hooks/useFetch";
import './css/userDetails.css';

const { Title, Text } = Typography;

export default function UserDetails(props) {
    const { id } = useParams()
    const [userProfile, setProfile] = useState(null)
    const { state } = useContext(AuthContext)
    const [showfollow, setShowFollow] = useState(state ? !state.following.includes(id) : true)
    const { get,post } = useFetch('http://localhost:3000/api/');
    const auth = useContext(AuthContext);

    useEffect(() => {
        get(`users/${id}`)
            .then(result => {
                if(auth.user !== null){
                    const alreadyFollower = result.followers.filter(f => f._id === auth.user.userId);
                    // console.log('alreadyFollower = ',alreadyFollower);
                    if(alreadyFollower.length > 0){
                        setShowFollow(false)
                    }
                }
                setProfile(result);
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    const followUser = () => {
        if(auth.user !== null){
            post(`users/${id}/follow-user`, {}
            ).then(data => {
                if(data.success){
                    setProfile((prevState) => {
                        const newFollower = {
                            _id:auth.user.userId,
                            email:auth.user.email,
                            first_name:auth.user.first_name,
                            last_name:auth.user.last_name
                        }
                        return {
                            ...prevState,
                            followers:[...prevState.followers,newFollower]
                        }
                    })
                    setShowFollow(false)
                }else{
                    message.warning(data.message);
                }
            }).catch(error=>{
                console.log(error);
                message.warning(error);
            })
        }else{
            props.onShowModal(true,'signin','Sign In');
        }
    }

    const unfollowUser = () => {
        if(auth.user !== null){
            post(`users/${id}/unfollow-user`, {}
            ).then(data => {
                if(data.success){
                    setProfile((prevState) => {
                        const newFollower = prevState.followers.filter(item => item._id != auth.user.userId);
                        return {
                            ...prevState,
                            followers: newFollower
                        }
                    })
                    setShowFollow(true);
                }else{
                    message.warning(data.message);
                }
                // dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })


            })
            .catch(error=>{
                console.log(error);
                message.warn('error',error);
            })
        }else{
            props.onShowModal(true,'signin','Sign In');
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
                                <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                    <h4>{userProfile.posts.length} posts</h4>
                                    <h4>{userProfile.followers.length} followers</h4>
                                    <h4>{userProfile.following.length} following</h4>
                                </div>
                                {showfollow ?
                                    <Button onClick={() => followUser()}>Follow</Button>
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
                                    // <img key={item._id} className="item" src={item.image_url} alt={item.description} />
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

        </>
    )
}