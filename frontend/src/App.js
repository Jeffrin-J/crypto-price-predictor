import { Layout } from 'antd';
import './App.css';
import CoinList from './components/CoinList';
import Navbar from './components/Navbar';
import { useSelector } from "react-redux";
import Forum from './components/Forum';
import CoinDescription from './components/CoinDescription';
import React, { useEffect, useState } from 'react'
import { API_URL } from "./constants";
import axios from "axios";
import Login from './components/Login';
import Register from './components/Register';
import { useDispatch } from "react-redux";
import { setLogin } from './slices/login';
import { setActive } from './slices/active';

function App() {
  
  const active = useSelector((state) => state.active.value);
  const coin = useSelector((state) => state.coin.value);
  const dispatch = useDispatch();
  
  const [tweets, setTweets] = useState([])

  useEffect(() => {
      axios.get(API_URL+'/getTweets').then((res) => {
          setTweets(res.data)
      })
      .catch((err)=>{console.log(err)})
  }, [])

  useEffect(() => {
    if(active==='logout'){
      localStorage.setItem('logged', false)
      localStorage.removeItem('user')
      dispatch(setLogin(false))
      dispatch(setActive('forum'))
    }
  }, [active])
  
  return (
    <div className="App">
      <Layout className='layout'>
        <Navbar/>
        {coin===-1 ? 
        <>
          {active==='coin_list' && <CoinList/>}
          {active==='forum' && <Forum tweets={tweets}/>}
          {active==='signin' && <Login/>}
          {active==='signup' && <Register/>}
        </>:
        <CoinDescription/>
        }
        
      </Layout>
    </div>
  );
}

export default App;
