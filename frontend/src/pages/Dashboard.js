import React, {useState, useContext, useEffect} from 'react';
import {Layout, Button, Modal, message, Row, Col, Typography, Spin} from 'antd';
import {Route, Switch} from 'react-router-dom';
import SigninForm from '../forms/SigninForm';
import SignupForm from '../forms/SignupForm';
import FileUpload from "../forms/FileUpload";
import AppHeader from "../components/AppHeader/AppHeader";
import fetch from '../custom-hooks/useFetch';
import {AuthContext} from '../context-provider/userContext';
import Category from "../components/Category";
import Meme from "./Meme";
import MemeDetails from "./MemeDetails";
import Sticky from 'react-stickynode';
import './css/index.css';
import UserDetails from "./UserDetails";

const {Title} = Typography;
const {Content} = Layout;

export default function Dashboard(props) {
    const auth = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [memes, setMemes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalFormType, setModalFormType] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    // const {get, post, put, isLoading} = fetch('https://meme-verse-2021.herokuapp.com/api/');
    const {get, post, put, isLoading} = fetch('http://localhost:3000/api/');

    useEffect(() => {
        get('category')
            .then(response => {
                setCategories(response);
            })
            .catch(error => {
                console.log(error);
            });

        get('meme')
            .then(response => {
                setMemes(response);
            })
            .catch(error => {
                console.log(error);
            });

    }, []);

    function setModal2Visible(val, type, title) {
        setModalVisible(val);
        setModalFormType(type);
        setModalTitle(title);
    }

    function handleSigninClick(values) {
        post('signin', values)
            .then(response => {
                console.log(response);
                if (response?.token) {
                    localStorage.setItem('token', JSON.stringify(response.token));
                    auth.setAuth().then(() => {
                        //let { from } = location.state || { from: { pathname: "/home" } };
                        console.log('logged in');
                        setModal2Visible(false, '');
                        //history.replace(from);
                    });

                } else {
                    message.error(response.message);
                }
            })
            .catch(error => {
                console.log(error);
            })
        console.log(values);
    }

    function handleSignupClick(values) {
        console.log(values);
    }

    function handleUpVoteClick(meme) {
        console.log(meme);
        put(`meme/${meme._id}`, {
            up_vote: ++meme.up_vote
        })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
    }

    function handleDownVoteClick(meme) {
        console.log(meme);
        put(`meme/${meme._id}`, {
            down_vote: ++meme.down_vote
        })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleStateChange = (status) => {
        if (status.status === Sticky.STATUS_FIXED) {
            console.log('the component is sticky');
        }
    }

    const modalContent = () => {
        let content;
        if(modalFormType === 'signin'){
            content = <SigninForm onSigninClick={handleSigninClick} onAccountClick={setModal2Visible}
                                  isLoading={isLoading}/>;
        }else if(modalFormType === 'signup'){
            content = <SignupForm onSignupClick={handleSignupClick} onSigninClick={setModal2Visible}
                                  isLoading={isLoading}/>;
        }else if(modalFormType === 'upload'){
            content = <FileUpload/>;
        }

        return content;
    }

    return (
        <>
            <Layout className="layout" style={{height: '100vh'}}>
                <AppHeader showModal={setModal2Visible}/>
                <Content className="content">
                    <Row>
                        <Col span={3} offset={3} className="div-category">
                            <Sticky enabled={true} top={65} bottomBoundary={1200} onStateChange={handleStateChange}>
                                <Title level={4} style={{paddingLeft: 10}}>All Section</Title>
                                <Category categories={categories}/>
                            </Sticky>
                        </Col>
                        <Col span={12} className="site-layout-content">
                            <Spin spinning={isLoading}>
                                <Switch>
                                    <Route path="/" exact>
                                        <Meme memes={memes}
                                              onUpVoteClick={handleUpVoteClick}
                                              onDownVoteClick={handleDownVoteClick}
                                              onShowModal={setModal2Visible}
                                        />
                                    </Route>
                                    <Route path="/meme/:type" exact>
                                        <Meme memes={memes}
                                              onUpVoteClick={handleUpVoteClick}
                                              onDownVoteClick={handleDownVoteClick}
                                              onShowModal={setModal2Visible}
                                        />
                                    </Route>
                                    <Route path="/details/:id" exact>
                                        <MemeDetails onUpVoteClick={handleUpVoteClick}
                                                     onDownVoteClick={handleDownVoteClick}
                                                     onShowModal={setModal2Visible}/>
                                    </Route>
                                    <Route path="/comments/:id" exact>
                                        <MemeDetails onUpVoteClick={handleUpVoteClick}
                                                     onDownVoteClick={handleDownVoteClick}
                                                     onShowModal={setModal2Visible}/>
                                    </Route>
                                    <Route path="/meme_user/:id" exact>
                                        <UserDetails onUpVoteClick={handleUpVoteClick}
                                                     onDownVoteClick={handleDownVoteClick}
                                                     onShowModal={setModal2Visible}/>
                                    </Route>
                                    <Route>
                                        <h1 style={{textAlign: 'center'}}>404 | Not Found</h1>
                                    </Route>
                                </Switch>
                            </Spin>
                        </Col>
                    </Row>
                </Content>
                <Modal
                    title={modalTitle}
                    centered
                    visible={modalVisible}
                    okButtonProps={{style: {display: 'none'}}}
                    cancelButtonProps={{style: {display: 'none'}}}
                    onCancel={() => setModal2Visible(false, '')}
                    width={"30vw"}
                    maskClosable={false}
                >
                    {
                        modalContent()
                    }
                </Modal>
            </Layout>
        </>
    );
}
