import { Layout } from '@/components/Layout';
import { message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';

export interface OutletContext {
  messageApi: MessageInstance;
}

const LayoutPage: FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <Layout>
      {contextHolder}
      
      <Outlet context={{ messageApi } satisfies OutletContext} />
    </Layout>
  );
};
export default LayoutPage;
