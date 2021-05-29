import React, { useContext, useState} from 'react';
import { Space, Button } from 'antd';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import '../pages/css/meme.css';
import { AuthContext } from "../context-provider/userContext";
import fetch from "../custom-hooks/useFetch";

export default function MemeButton(props) {
    const { item } = props;
    const auth = useContext(AuthContext);
    const { put } = fetch(process.env.REACT_APP_BASE_URL);
    const [ memeDeatils, setMemeDeatils ] = useState(item);

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    const checkLiking = (items) => {
        if(items != undefined){
            let hasUser = items.filter(item => (item == auth?.user?.userId));
            return hasUser.length > 0 ? true : false;
        }
        return false;
    }

    function handleUpVoteClick(meme) {
        let url = `meme/like/${meme._id}`;
        let alreadyExists = meme.likes.filter(item => (item == auth.user.userId));
        if (alreadyExists.length > 0) {
            url = `meme/removelike/${meme._id}`;
        }
        put(url, {})
            .then(response => {
                setMemeDeatils({...memeDeatils,likes:[...response.data.likes],unlikes:[...response.data.unlikes]});
            })
            .catch(error => {
                console.log(error);
            })
    }

    function handleDownVoteClick(meme) {
        let url = `meme/unlike/${meme._id}`;
        let alreadyExists = meme.unlikes.filter(item => (item == auth.user.userId));
        if (alreadyExists.length > 0) {
            url = `meme/removeunlike/${meme._id}`;
        }
        put(url, {})
            .then(response => {
                setMemeDeatils({...memeDeatils,likes:[...response.data.likes],unlikes:[...response.data.unlikes]});
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <div>
            <Button className={checkLiking(memeDeatils?.likes) ? 'button-selected' : ''} onClick={() => auth.user !== null ? handleUpVoteClick(memeDeatils) : props.singinModal(true, 'signin', 'Sign In')}>
                <IconText icon={LikeOutlined}
                    text={memeDeatils?.likes?.length}
                    key="list-vertical-like-o" />
            </Button>,
            <Button className={checkLiking(memeDeatils?.unlikes) ? 'button-selected' : ''} onClick={() => auth.user !== null ? handleDownVoteClick(memeDeatils) : props.singinModal(true, 'signin', 'Sign In')}>
                <IconText icon={DislikeOutlined}
                    text={memeDeatils?.unlikes?.length}
                    key="list-vertical-like-o" />
            </Button>
        </div>
    );
}