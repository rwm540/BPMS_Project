'use client';

import { useState, useEffect, FC } from 'react';
import Container from '@Component/admin/container/container';
import BottomChart from '@Component/admin/dashboard/bottomChart';
import MainChart from '@Component/admin/dashboard/mainChart';
import TopChart from '@Component/admin/dashboard/topChart';
import Loading from '../../../Loading/Loading';
import Loadingform from '../../../Loading/Loadingdashboard';

/* Import Value */
import Menu from "../../container/menu";
import drawer from "../../container/drawer";


interface DashboardPageProps {
  IdConnect:string;
}

const DashboardPage: FC<DashboardPageProps> = ({ IdConnect }) => {
  const [Loaded, setLoaded] = useState(true); // در شروع لودینگه
  const [LoadedForm,setLoadedForm]= useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(false);
    }, 900); // شبیه‌سازی لودینگ (1.0 ثانیه)
    return () => clearTimeout(timer); // cleanup
  }, []);


  // شرط بیرون از JSX چون پرانتز return باید فقط یک JSX بده
  if (Loaded) {
    return <Loading />;
  }

  return (
    <Container IdConnect={IdConnect} >
      {/* <TopChart />
      <MainChart />
      <BottomChart /> */}
    </Container>
  );
};

export default DashboardPage;