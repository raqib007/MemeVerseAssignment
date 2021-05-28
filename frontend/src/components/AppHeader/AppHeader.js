import React, {useContext} from 'react';
import {Button, Layout, Avatar} from "antd";
import "./AppHeader.css";
import {Link} from "react-router-dom";
import {AuthContext} from "../../context-provider/userContext";
import logo from "../../assets/img/logo.png";
import {UserOutlined, UploadOutlined} from '@ant-design/icons';

export default function AppHeader(props) {
    const auth = useContext(AuthContext);
    const {Header} = Layout;
    function handleLogoutClick(){
        if(localStorage.getItem('token')){
            localStorage.removeItem("token");
            auth.clearAuth().then(()=>{
                console.log('signed out');
            })
        }
    }

    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div className="header-content">
                <Link to={"/"}><img className="logo" src={logo} alt=""/></Link>
                {auth.user !== null ?
                ( <div className="header-button">
                    <Avatar icon={<UserOutlined />} /> &nbsp;&nbsp;
                    <Button type="primary" onClick={() => props.showModal(true,'upload','Create Post')}
                            shape="round" icon={<UploadOutlined />}>Upload</Button>
                    <Button type="text" onClick={() => handleLogoutClick()}>Logout</Button>
                </div>
                ) :
                ( <div className="header-button">
                    <Button type="text" onClick={() => props.showModal(true,'signin','Sign In')}>Login</Button>
                    <Button type="text" onClick={() => props.showModal(true,'signup','Sign Up')}>Sign Up</Button>
                </div>)}

            </div>
        </Header>
    );
}
