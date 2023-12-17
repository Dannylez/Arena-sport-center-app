import Header from './components/shared/header';
import styles from './app.module.css';
import Schedule from './components/schedule';
import Landing from './components/landing';

function App() {
  return (
    <div>
      <Header />
      <div className={styles.principalContent}>
        <Landing />
        <Schedule />
      </div>
    </div>
  );
}

export default App;
