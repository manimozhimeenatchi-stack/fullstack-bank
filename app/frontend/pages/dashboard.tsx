import { StatusCodes } from 'http-status-codes';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GrUpdate } from 'react-icons/gr';
import { MdLogout } from 'react-icons/md';
import TransactionsList from '../components/TransactionsList';
import TransferForm from '../components/TransferForm';
import service from '../service';
import styles from '../styles/pages/Dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [username, setUserName] = useState('');

  // Using English number format
  const [balance, setBalance] = useState('0.00');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('userData');
    router.push('/');
  };

  const handleUpdateBalance = async (authorization: string) => {
    if (token) {
      const response = await service.get.balance(authorization);
      const data = await response.json();

      switch (response.status) {
        case StatusCodes.OK:
          setErrorMessage('');
          // Convert to English decimal format
          setBalance(data.balance.toFixed(2));
          break;

        case StatusCodes.UNAUTHORIZED:
          handleLogout();
          break;

        default:
          setErrorMessage(data.message);
          break;
      }
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('userData');

    if (!userData) {
      router.push('/');
    }

    const parsedData = JSON.parse(userData as string);

    setToken(parsedData.token);
    setUserName(parsedData.username);
  }, []);

  useEffect(() => {
    handleUpdateBalance(token);
  }, [token]);

  return (
    <div className={styles.page}>
      <Head>
        <title>DW.CASH - Dashboard</title>
        <meta
          name="description"
          content="Full stack digital wallet project developed by Manimozhi"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1>{`Hello @${username}`}</h1>
        <button type="button" title="Logout" onClick={handleLogout}>
          <MdLogout />
        </button>
      </header>

      <main className={styles.main}>
        <section className={styles.balance}>
          <div className={styles.balance__label}>
            <h2>Available Balance:</h2>
            <button
              type="button"
              title="Refresh"
              onClick={() => handleUpdateBalance(token)}
            >
              <GrUpdate />
            </button>
          </div>

          {/* Display in English currency format */}
          <span className={styles.balance__value}>{`$ ${balance}`}</span>

          {!!errorMessage && <p>{errorMessage}</p>}
        </section>

        <TransferForm token={token} updateBalance={handleUpdateBalance} />

        <TransactionsList
          token={token}
          username={username}
          balance={balance}
        />
      </main>
    </div>
  );
}
