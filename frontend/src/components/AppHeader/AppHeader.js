import React, {useContext} from 'react';
import {Button, Layout, Menu, Avatar, Upload} from "antd";
import "./AppHeader.css";
import {NavLink,useHistory,useLocation} from "react-router-dom";
import {AuthContext} from "../../context-provider/userContext";
import logo from "../../assets/img/logo.png";
import {UserOutlined, UploadOutlined} from '@ant-design/icons';

export default function AppHeader(props) {
    const auth = useContext(AuthContext);
    const {Header} = Layout;
    const history = useHistory();
    const location = useLocation();

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
                <img className="logo" src={logo} />
                {auth.user !== null ?
                ( <div className="header-button">
                    <Avatar icon={<UserOutlined />} /> &nbsp;&nbsp;
                    <Button type="primary" shape="round" icon={<UploadOutlined />}>Upload</Button>
                    <Button type="text" onClick={() => handleLogoutClick()}>Logout</Button>
                </div>
                ) :
                ( <div className="header-button">
                    <Button type="text" onClick={() => props.showModal(true,'signin')}>Login</Button>
                    <Button type="text" onClick={() => props.showModal(true,'signup')}>Sign Up</Button>
                </div>)}

            </div>
        </Header>
    );
}
