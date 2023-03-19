import { Button, Form, Input, Space, InputNumber, TimePicker, } from 'antd';
import React, { useState } from 'react';
import styles from '../styles/party.module.css';
import axios from 'axios';
import dayjs from 'dayjs';

const { TextArea } = Input;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Group: React.FC = () => {
  const [form] = Form.useForm();
  const [unixTime, setUnixTime] = useState(0);

  const onChange = (value: dayjs.Dayjs | null, dateString: string) => {
    if (value != null)
        setUnixTime(value.valueOf());
  };

  const onFinish = () => {
    let body = form.getFieldsValue(['title', 'menu', 'deliveryPrice', 'currentPeopleNum', 'maximumPeopleNum'
    , 'content']);
    body.matchingEndTime = unixTime;
    body.available = true;
    let time = Date.now();
    body.createdAt = time;
    body.updatedAt = time;
    body.intraId = 'default';
    console.log(body, body.matchingEndTime);
    axios.post("http://13.125.149.237:8080/posts", body);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <>
    <h1 className={styles.title}>배달 그룹 만들기</h1>
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      initialValues={{
        ["title"]: '같이 배달 시키실 분~~',
        ["menu"]: "미정",
        ["currentPeopleNum"]: 1,
        ["maximumPeopleNum"]: 300,
        ['content']: "",
      }}
      className={styles.form}
    >
      <Form.Item name="title" label="배달 그룹명" rules={[{ required: true }]}>
        <Input placeholder='그룹 이름을 적어주세요'/>
      </Form.Item>
      <Form.Item name="menu" label="메뉴 혹은 지점" rules={[{ required: true }]}>
        <Input placeholder='메뉴 또는 지점을 적어주세요'/>
      </Form.Item>
      <Form.Item name="deliveryPrice" label="예상 배달 팁" rules={[{ required: false }]}>
        <InputNumber min={0} max={100000} />
      </Form.Item>
      <Space direction="horizontal">
        <Form.Item name="currentPeopleNum" label="현재 인원" rules={[{ required: true }]}>
          <InputNumber min={0} max={100} />
        </Form.Item>
        <Form.Item name="maximumPeopleNum" label="최대 인원" rules={[{ required: true }]}>
          <InputNumber min={0} max={300} />
        </Form.Item>
      </Space>
      <Form.Item name="matchingEndTime" label="마감시간" rules={[{ required: true }]}>
        <TimePicker format="HH:mm" showNow={true} onChange={onChange}/>
      </Form.Item>
      <Form.Item name="content" label="하고 싶은 말" rules={[{ required: false }]}>
      <TextArea rows={4} placeholder="200자 제한" maxLength={200} />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          제출
        </Button>
        <Button htmlType="button" danger onClick={onReset}>
          취소
        </Button>
      </Form.Item>
    </Form>
    </>
  );
};

export default Group;