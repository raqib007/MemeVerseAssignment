import React from 'react';
import { List, Avatar, Menu } from 'antd';
import '../pages/css/category.css';
import { Link } from "react-router-dom";
import {
    MailOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    SettingOutlined,
    LinkOutlined,
} from '@ant-design/icons';

export default function Category(props) {
    return (
        <div className="div-category-list">
            <List
                itemLayout="horizontal"
                dataSource={props.categories}
                renderItem={item => (
                    <List.Item onClick={()=>console.log(item)}>
                        <List.Item.Meta
                            avatar={<Avatar shape="square" size="small"
                                src="https://miscmedia-9gag-fun.9cache.com/images/thumbnail-facebook/1557216707.0007_ESESyM_100x100.jpg"
                            />}
                            title={<Link to={`/${item.name}`}>{item.name}</Link>}
                        />
                    </List.Item>
                    
                )}
            />
        </div>
    );
    
}
