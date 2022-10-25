import { Layout } from 'antd';
import './App.css';
import CoinList from './components/CoinList';
import Navbar from './components/Navbar';
import { useSelector } from "react-redux";
import Forum from './components/Forum';
import CoinDescription from './components/CoinDescription';

function App() {
  
  const active = useSelector((state) => state.active.value);
  const coin = useSelector((state) => state.coin.value);
  
  return (
    <div className="App">
      <Layout className='layout'>
        <Navbar/>
        {coin===-1 ? 
        <>
          {active==='coin_list' && <CoinList/>}
          {active==='forum' && <Forum/>}
        </>:
        <CoinDescription/>
        }
        
      </Layout>
    </div>
  );
}

export default App;
