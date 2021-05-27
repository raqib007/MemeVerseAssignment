import React, { useState, useContext, useEffect } from 'react';
import {Layout, Button, Modal, message, Row, Col} from 'antd';
import './css/index.css';
import {Route, Switch} from 'react-router-dom';
import SigninForm from '../forms/SigninForm';
import SignupForm from '../forms/SignupForm';
import AppHeader from "../components/AppHeader/AppHeader";
import fetch from '../custom-hooks/useFetch';
import {AuthContext} from '../context-provider/userContext';
import Category from "../components/Category";
import Meme from "../components/Meme";
import MemeDetails from "./MemeDetails";

const {Content} = Layout;

export default function Dashboard(props) {
    const auth = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [memes, setMemes] = useState([]);
    const [modalVisible , setModalVisible ] = useState(false);
    const [modalFormType, setModalFormType] = useState('');
    const {get, post, put, isLoading} = fetch('http://localhost:3000/api/');

    useEffect(()=>{
        get('category')
            .then(response=>{
                setCategories(response);
            })
            .catch(error=>{
                console.log(error);
            });

        get('meme')
            .then(response=>{
                setMemes(response);
            })
            .catch(error=>{
                console.log(error);
            });

    },[]);

    function setModal2Visible(val,type) {
        setModalVisible(val);
        setModalFormType(type);
    }

    function handleSigninClick(values){
        post('signin',values)
            .then(response=>{
                console.log(response);
                if (response?.token) {
                    localStorage.setItem('token',JSON.stringify(response.token));
                    auth.setAuth().then(()=>{
                        //let { from } = location.state || { from: { pathname: "/home" } };
                        console.log('logged in');
                        setModal2Visible(false,'');
                        //history.replace(from);
                    });

                }else{
                    message.error(response.message);
                }
            })
            .catch(error=>{
                console.log(error);
            })
        console.log(values);
    }

    function handleSignupClick(values){
        console.log(values);
    }

    function handleUpVoteClick(meme){
        console.log(meme);
        put(`meme/${meme._id}`,{
           up_vote: ++meme.up_vote
        })
        .then(response=>{
            console.log(response);
        })
        .catch(error=>{
            console.log(error);
        })
    }

    function handleDownVoteClick(meme){
        console.log(meme);
        put(`meme/${meme._id}`,{
            down_vote: ++meme.down_vote
        })
        .then(response=>{
            console.log(response);
        })
        .catch(error=>{
            console.log(error);
        })
    }

    return (
        <>
            <Layout className="layout" style={{height:'100vh'}}>
                <AppHeader showModal={setModal2Visible} />
                <Content className="content">
                    <Row>
                        {/* <Col span={3} offset={3} className="div-category"> */}
                        <Col span={4} className="div-category">
                            <Category categories={categories}/>
                        </Col>
                        {/* <Col span={12} className="site-layout-content"> */}
                        <Col span={20} className="site-layout-content">
                            <Switch>
                                <Route path="/" exact>
                                    <Meme memes={memes} onUpVoteClick={handleUpVoteClick} onDownVoteClick={handleDownVoteClick}/>
                                </Route>
                                <Route path="/meme/:type" exact>
                                    <Meme memes={memes} onUpVoteClick={handleUpVoteClick} onDownVoteClick={handleDownVoteClick}/>
                                </Route>
                                <Route path="/details/:id" exact>
                                    <MemeDetails onUpVoteClick={handleUpVoteClick} onDownVoteClick={handleDownVoteClick}/>
                                </Route>
                                <Route path="/comments/:id" exact>
                                    <MemeDetails onUpVoteClick={handleUpVoteClick} onDownVoteClick={handleDownVoteClick}/>
                                </Route>
                                <Route>
                                    <h1 style={{textAlign:'center'}}>404 | Not Found</h1>
                                </Route>
                            </Switch>
                        </Col>
                    </Row>
                </Content>
                <Modal
                    title={modalFormType === 'signin' ? 'Sign In': 'Sign Up'}
                    centered
                    visible={modalVisible}
                    okButtonProps={{style:{display:'none'}}}
                    cancelButtonProps={{style:{display: 'none'}}}
                    onCancel={() => setModal2Visible(false,'')}
                    width={"30vw"}
                >
                    {
                        modalFormType === 'signin' ?
                        <SigninForm onSigninClick={handleSigninClick} onAccountClick={setModal2Visible} isLoading={isLoading}/> :
                        <SignupForm onSignupClick={handleSignupClick} onSigninClick={setModal2Visible} isLoading={isLoading}/>
                    }
                </Modal>
            </Layout>
        </>
    );
}
