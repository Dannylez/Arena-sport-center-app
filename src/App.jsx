import Header from './components/shared/header';
import styles from './app.module.css';
import Schedule from './components/schedule';
import Landing from './components/landing';
import MemberList from './components/members/list';
import MemberForm from './components/members/form';
import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/login';
import TrainerProfile from './components/trainers/profile';

function App() {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <div>
      <Header menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
      <div
        className={styles.principalContent}
        onClick={() => setMenuOpened(false)}
      >
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/schedule' element={<Schedule />} />
          <Route path='/members' element={<MemberList />} />
          <Route path='/members/form' element={<MemberForm />} />
          <Route path='/trainer/profile' element={<TrainerProfile />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
