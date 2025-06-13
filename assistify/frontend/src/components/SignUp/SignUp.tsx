import { SignUpParams } from '@/types';
import { Button, Flex, Form, Input, Typography } from 'antd';
import { FC } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useNavigate } from 'react-router-dom';
import { SignUpFormSchema } from './constants';
import { useSignUpForm } from './hooks';
import { useSignUpMutation } from './hooks/useSignUpMutation';
const { Title, Link } = Typography;
export const SignUp: FC = () => {
  const navigate = useNavigate();
  const { handleSubmit, control } = useSignUpForm();
  const { mutate, isLoading } = useSignUpMutation();
  const submitHanlder: SubmitHandler<SignUpFormSchema> = (data) => {
    mutate(data as SignUpParams, {
      onSuccess() {
        navigate('/');
      },
    });
  };
  return (
    <section>
      <div className="my-container pt-24">
        <Form
          onFinish={handleSubmit(submitHanlder)}
          className="bg-white px-8 pt-8 rounded-3xl pb-11 mb-8 shadow-[0px_4px_4px_0px_#00000040]"
        >
          <Title className="font-bold text-center" level={3}>
            Регистрация
          </Title>
          <FormItem
            control={control}
            name="username"
            label="Имя пользователя"
            className="[&_.ant-form-item-label]:pb-0"
          >
            <Input placeholder="Заполните это поле" className="border border-input" />
          </FormItem>

          <FormItem control={control} name="email" label="Электронная почта" className="[&_.ant-form-item-label]:pb-0">
            <Input placeholder="Заполните это поле" className="border border-input" />
          </FormItem>

          <FormItem control={control} name="password" label="Пароль" className="[&_.ant-form-item-label]:pb-0">
            <Input.Password placeholder="Заполните это поле" className="border border-input" />
          </FormItem>

          <Form.Item wrapperCol={{ span: 1, offset: 4 }}>
            <Button loading={isLoading} type="primary" htmlType="submit">
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>
        <Flex justify="center" gap={9} align="center">
          <Link href="/signin" className="text-center text-white block">
            Уже есть аккаунт?
          </Link>
          <Button ghost onClick={() => navigate('/signin')} color="default" variant="outlined">
            Войти
          </Button>
        </Flex>
      </div>
    </section>
  );
};
