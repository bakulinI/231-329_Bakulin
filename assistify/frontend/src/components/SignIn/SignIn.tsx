import { SignInParams } from '@/types';
import { Button, Flex, Form, Input, Typography } from 'antd';
import { FC } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useNavigate } from 'react-router-dom';
import { SignInFormSchema } from './constants';
import { useSignInForm, useSignInMutation } from './hooks';

const { Title, Link } = Typography;
export const SignIn: FC = () => {
  const navigate = useNavigate();
  const { handleSubmit, control } = useSignInForm();
  const { mutate, isLoading } = useSignInMutation();
  const submitHanlder: SubmitHandler<SignInFormSchema> = (data) => {
    mutate(data as SignInParams, {
      onSuccess() {
        navigate('/');
      },
    });
  };
  return (
    <section>
      <div className="my-container pt-24 ">
        <Form
          onFinish={handleSubmit(submitHanlder)}
          className="bg-white px-8 pt-8 rounded-3xl pb-11 mb-5 shadow-[0px_4px_4px_0px_#00000040]"
        >
          <Title className="font-bold text-center" level={3}>
            Авторизация
          </Title>
          <FormItem
            control={control}
            name="username"
            label="Имя пользователя"
            className="[&_.ant-form-item-label]:pb-0"
          >
            <Input placeholder="Заполните это поле" className="border border-input" />
          </FormItem>

          <FormItem control={control} name="password" label="Пароль" className="[&_.ant-form-item-label]:pb-0">
            <Input.Password placeholder="Заполните это поле" className="border border-input" />
          </FormItem>

          <Form.Item wrapperCol={{ span: 2, offset: 8 }}>
            <Button loading={isLoading} type="primary" htmlType="submit">
              Войти
            </Button>
          </Form.Item>
        </Form>
        <Flex justify="center" gap={9} align="center">
          <Link href="/signup" className="text-center text-white block">
            Еще нет аккаунта?
          </Link>
          <Button ghost onClick={() => navigate('/signup')} color="default" variant="outlined">
            Зарегистрироваться
          </Button>
        </Flex>
      </div>
    </section>
  );
};
