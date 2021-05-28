import React,{useEffect,useState} from "react";
import {useParams} from 'react-router-dom';
import useFetch from "../custom-hooks/useFetch";

export default function UserDetails(){
    const params = useParams();
    const [user,setUser] = useState({});
    const {get,isLoading} = useFetch('http://localhost:3000/api/');


    useEffect(()=>{
       get(`users/${params.id}`)
           .then(response=>{
               console.log(response)
              //setUser(response);
           })
           .catch(error=>{
               console.log(error);
           });
    },[])

    return(<>
        {JSON.stringify(user)}
        </>);
}