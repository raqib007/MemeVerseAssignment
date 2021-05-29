import React, {useState, useContext, useEffect} from 'react';
import {Layout, Modal, Row, Col, Typography, message} from 'antd';
import {Route, Switch} from 'react-router-dom';
import SigninForm from '../forms/SigninForm';
import SignupForm from '../forms/SignupForm';
import FileUpload from "../forms/FileUpload";
import AppHeader from "../components/AppHeader/AppHeader";
import useFetch from '../custom-hooks/useFetch';
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
    const [modalVisible, setModalVisible] = useState(false);
    const [modalFormType, setModalFormType] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [errorMsg, seterrorMsg] = useState('');
    const {get, put, isLoading} = useFetch(process.env.REACT_APP_BASE_URL);
    const base_url = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        get('category')
            .then(response => {
                setCategories(response);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    function setModal2Visible(val, type, title) {
        setModalVisible(val);
        setModalFormType(type);
        setModalTitle(title);
        seterrorMsg('');
    }

    function handleSigninClick(values) {
        fetch(`${base_url}signin`,{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(values)
        }).then(res=>{
            if(res.status == 200){
                seterrorMsg('');
                return res.json();
            }else{
                message.error('Username or password wrong!');
                seterrorMsg('Username or password wrong!');
                throw new Error("HTTP status " + res.status);
            }
        }).then(data=>{
            localStorage.setItem('token', JSON.stringify(data.token));
            auth.setAuth().then(() => {
                setModal2Visible(false, '');
            });
        }).catch(err=>{
            console.log('err',err);
        });
    }

    function handleSignupClick(values) {
        console.log(values);
        fetch(`${base_url}users`,{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(values)
        }).then(res=>{
            //console.log(res);
            if(res.status == 200){
                seterrorMsg('');
                return res.json();
            }else{
                seterrorMsg(res.message);
                throw new Error("HTTP status " + res.status);
            }
        }).then(data=>{
            console.log(data);
            if(data.success){
                setModal2Visible(true, 'signin','Sign In');
            }else{
                message.error(data.message);
                seterrorMsg(data.message);
            }
        }).catch(err=>{
            console.log('err',err);
        })
    }

    function handleUpVoteClick(meme) {
        let url = `meme/like/${meme._id}`;
        let alreadyExists = meme.likes.filter(item=>(item == auth.user.userId));
        if(alreadyExists.length > 0){
            url = `meme/removelike/${meme._id}`;
        }
        put(url, {})
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
    }

    function handleDownVoteClick(meme) {
        let url = `meme/unlike/${meme._id}`;
        let alreadyExists = meme.likes.filter(item=>(item == auth.user.userId));
        if(alreadyExists.length > 0){
            url = `meme/removeunlike/${meme._id}`;
        }
        put(url, {})
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
                                  isLoading={isLoading} errorMsg={errorMsg}/>;
        }else if(modalFormType === 'signup'){
            content = <SignupForm onSignupClick={handleSignupClick} onSigninClick={setModal2Visible}
                                  isLoading={isLoading} errorMsg={errorMsg}/>;
        }else if(modalFormType === 'upload'){
            content = <FileUpload modalStatus={setModal2Visible} user={auth.user.userId}/>;
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
                                <Switch>
                                    <Route path="/" exact>
                                        <Meme onUpVoteClick={handleUpVoteClick}
                                              onDownVoteClick={handleDownVoteClick}
                                              onShowModal={setModal2Visible}
                                        />
                                    </Route>
                                    <Route path="/meme/:id" exact>
                                        <Meme onUpVoteClick={handleUpVoteClick}
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
