import { useAuth } from '@/common';
import { Button, Flex, Typography } from 'antd';
import React, { FC } from 'react';
import {useNavigate} from "react-router-dom";

const { Title, Link } = Typography;

interface RequiredAuthProps {
  children: React.ReactNode;
}

const RequiredAuth: FC<RequiredAuthProps> = ({ children }) => {
  const { auth } = useAuth();
  const navigate = useNavigate()
  return auth ? (
    children
  ) : (
    <Flex justify="center" gap={15} vertical align="center" className="pt-20">
      <Title className="text-center" level={1} color={"#211656"}>
        Только для авторизованных пользователей!
      </Title>
      <Button onClick={() => navigate("/signin")} size={"large"}>
        Войти
      </Button>
    </Flex>
  );
};

export default RequiredAuth;
