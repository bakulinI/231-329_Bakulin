import { Button, Typography } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export const Home: FC = () => {
  const navigate = useNavigate();
  return (
    <div className="my-container">
      <Title className="text-white text-center pt-4" level={1}>
        Приветствуем в Assistify
      </Title>
      <Button onClick={() => navigate('edit')} className="mx-auto block">
        Перейти в настройку профиля
      </Button>
      {/* <img src="./logo.svg" alt="logo" className="mb-4" /> */}
      {/* {visible && (
  <img src="https://cdn.dribbble.com/users/37530/screenshots/2937858/drib_blink_bot.gif" alt="money" />
)} */}
    </div>
  );
};
