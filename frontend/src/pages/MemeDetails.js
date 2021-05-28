import React, { useContext, useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import { Avatar, Button, Image, Form, Input, Comment, Divider, Skeleton, Spin ,List, message} from "antd";
import { UserOutlined } from "@ant-design/icons";
import useFetch from '../custom-hooks/useFetch';
import { AuthContext } from "../context-provider/userContext";
import MemeButton from "../components/MemeButton";

export default function MemeDetails(props) {
    const params = useParams();
    const auth = useContext(AuthContext);
    const { get, post, put, isLoading } = useFetch(process.env.REACT_APP_BASE_URL);
    const [meme, setMeme] = useState({});
    const [comment, setComment] = useState('');
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { TextArea } = Input;
    useEffect(() => {
        setShowSkeleton(true);
        get(`meme/getById/${params.id}`)
            .then(response => {
                setMeme(response);
                setShowSkeleton(false);
            })
            .catch(error => {
                setShowSkeleton(false);
            });
    }, []);

    const handleSubmit = () => {
        if (auth.user !== null) {
            if(comment != ''){
                setSubmitting(true);
                let comments = Object.assign({}, {
                    meme_id: params.id,
                    user_id: auth.user.userId,
                    comment: comment
                });
                post('comment', comments)
                    .then(response => {
                        const { comments } = meme;
                        let resData = response.data;
                        let userData = {
                            _id:auth.user.userId,
                            first_name:auth.user.first_name,
                            last_name:auth.user.last_name
                        }
                        Object.assign(resData,{user_id:userData});
                        const newComments = [...comments, resData];
                        setMeme({ ...meme, comments: newComments })
                        setComment('');
                        setSubmitting(false);
                    })
                    .catch(error => {
                        console.log(error);
                        setSubmitting(false);
                    })
            }
        } else {
            props.onShowModal(true, 'signin', 'Sign In');
        }
    };

    const handleChange = e => {
        setComment(e.target.value);
    };

    const handleCommentDelete = (e,comment) =>{
        e.preventDefault();
        console.log(comment);
        put(`comment/${comment._id}`,{deleted:true})
        .then(response=>{
           console.log(response);
           message.success('Comment deleted');
           const newComments = meme.comments.filter(com=> com._id !== comment._id);
           setMeme({...meme, comments : newComments});
        })
        .catch(error=>{
            console.log(error);
        })
    }

    return (
        <Spin spinning={isLoading}>
            <div style={{ padding: "10px 24px" }}>
                <Skeleton avatar paragraph={{ rows: 12 }} loading={showSkeleton} active>
                    <div><Avatar size="small" shape="square" icon={<UserOutlined />} /> {meme?.category?.name} - 1h</div>
                    <h2>{meme?.description}</h2>
                    <p>{meme?.comments?.length} Comments</p>
                    <div>
                        {!isLoading && <MemeButton item={meme} singinModal={props.onShowModal} />}
                    </div>
                    <div style={{ marginTop: 10 }}>
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
                    <Divider />
                    <div>
                        <Comment
                            content={
                                <>
                                    <Form.Item>
                                        <TextArea rows={4} onChange={handleChange} value={comment} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button htmlType="submit" loading={submitting} onClick={handleSubmit} type="primary">
                                            Add Comment
                                    </Button>
                                    </Form.Item>
                                </>
                            }
                        />
                    </div>
                    <List
                        dataSource={meme?.comments}
                        header={`${meme.comments?.length} ${meme?.comments?.length > 1 ? 'comments' : 'comments'}`}
                        itemLayout="horizontal"
                        renderItem={item => (
                            <List.Item
                                actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more" onClick={(e)=>handleCommentDelete(e,item)}>remove</a>]} 
                            >
                                <List.Item.Meta
                                    avatar={<Avatar style={{backgroundColor: '#00a2ae',verticalAlign: 'middle'}}size={45}>{item.user_id?.first_name}</Avatar>}
                                    title={<Link to={`/meme_user/${item.user_id?._id}`}>{item.user_id?.first_name} {item.user_id?.last_name}</Link>}
                                    description={item.comment}/>
                            </List.Item>
                            )}
                        />

                </Skeleton>
            </div>
        </Spin>
    )
}