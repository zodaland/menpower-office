import type { NextPage } from 'next';
import Head from 'next/head';

import HeaderComponent from '../components/Header';
import FooterComponent from '../components/Footer';

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>YesGada</title>
            </Head>
            <HeaderComponent />
            <div>
                <span className="p-10">hello</span>
            </div>
            <FooterComponent />
        </>
    );
};

export default Home;
