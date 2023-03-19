import { Layout, Button, Switch, Space, Dropdown, Collapse, Table, Modal, 
  FloatButton, Input, Form, Checkbox, InputNumber } from "antd";
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import React, {useState} from 'react';
import styles from '../styles/header.module.css';
import {FormOutlined, UserOutlined} from '@ant-design/icons';
import axios from "axios";
import {join} from "path";
import { useEffect } from 'react';
import { useRouter, NextRouter } from 'next/router';
import Cookies from 'js-cookie';
import withAuth from "../components/withAuth";
import { getNickname, getNicknameFromToken, goMainPage, logOut } from '../utils/utils';
import { nicknameState } from "../components/atom";
import { useRecoilState } from "recoil";

axios.defaults.withCredentials = true;
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';

function removeCodeFromUrl() {
  const { protocol, host, pathname } = window.location;
  const newUrl = `${protocol}//${host}${pathname}`;
  window.history.replaceState({}, document.title, newUrl);
}

async function setCookieFromCode(router: NextRouter) {
  const code = new URLSearchParams(window.location.search).get("code");
  if (code !== null) {
    removeCodeFromUrl();
    console.log('code: ', code);
    console.log(process.env.NEXT_PUBLIC_API_UID);
    try {
      const { data } = await axios.post('oauth/token', {
        withCredentials: true,
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_API_UID,
        client_secret: process.env.NEXT_PUBLIC_API_SECRET,
        code: code,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
      });
      if (data.status >= 400) {
        throw new Error("Failed to get access token");
      }
      goMainPage(router);
      Cookies.set("accessToken", data.access_token);
      console.log(getNickname());
    } catch (error) {
      console.error(error);
    }
  }
}

React.useLayoutEffect = React.useEffect;

const { TextArea } = Input;
const { Panel } = Collapse;
const { Header, Footer, Sider, Content } = Layout;

interface DataType {
  intraId: string;
  partyTitle: string;
  peopleNum: number;
  joinable: boolean;
  postId: any;
}

const columns: ColumnsType<DataType> = [
  {
      title: '파티장',
      dataIndex: 'intraId',
      key: 'intraId',
      render: (text) => <p>{text}</p>,
  },
  {
      title: '파티 이름',
      dataIndex: 'partyTitle',
      key: 'partyTitle',
      render: (text) => <p>{text}</p>,
  },
  {
      title: '파티 인원',
      dataIndex: 'peopleNum',
      key: 'peoplwNum',
      render: (text) => <p>{text}</p>,
  },
  {
      title: '공동 식사 여부',
      dataIndex: 'joinable',
      key: 'joinable',
      render: (joinable) => joinable == true ? <p>같이 먹어도 되요</p> : <p>따로 먹을게요</p>,
  },
  {
    title: '수정/삭제',
    key: 'action',
    render: (_, record) => (
      <>
        <Button>수정</Button>
        <Button danger>삭제</Button>
      </>
    ),
  }
];

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
wrapperCol: { offset: 8, span: 16 },
};


function UserComment({ comment } : any, { key } : any){
  const [isCommentModalOpen, setICommentModalOpen] = useState(false);

    const showCommentModal = () => {
        setICommentModalOpen(true);
    };

    const handleCommentDelete = () => {
        //comment delete 하는 부분
        
        setICommentModalOpen(false);
    };

    const handleCommentCancel = () => {
        setICommentModalOpen(false);
    };

    return (
        <>
            <Space direction="horizontal">
                <p>{comment.intraId}</p>
                <Button size="small" >수정</Button>
                <Button size="small" danger onClick={showCommentModal}>삭제</Button>
                <Modal open={isCommentModalOpen} onOk={handleCommentDelete} onCancel={handleCommentCancel}>
                    정말로 삭제하시겠습니까?
                </Modal>
            </Space>
            <div style={{wordBreak: "break-all"}}>{comment.content}</div>
        </>
    );
}

function UserCard({ card } : any, { key } : any){

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parties, setParties] = useState([]);
  const [comments, setComments] = useState(Array());

  const [form] = Form.useForm();
  const totalPrice = card.deliveryPrice;
  const peopleBefore = card.currentPeople;
  const [values, setValues] = useState({peopleNum: peopleBefore + 1,
    expectedPrice: totalPrice != undefined ? Math.round(totalPrice/(peopleBefore + 1)) : undefined});
  const maxP = card.maxPeople - peopleBefore;
  const {peopleNum, expectedPrice} = values;

  const [text, setText] = useState("");

  const showModal = () => {
      setIsModalOpen(true);
  };

  const postParty = async () => {
      let body = {
          postId: card._id,
          intraId: "default",
          partyTitle: form.getFieldValue("partyTitle"),
          joinable: form.getFieldValue("joinable"),
          peopleNum: form.getFieldValue("peopleNum"),
      }
      await axios.post("parties", body);
      setIsModalOpen(false);
  };

  const handleCancel = () => {
      setIsModalOpen(false);
  };

  const onChange = () => {
    setValues({
      peopleNum: peopleBefore + form.getFieldValue("peopleNum"),
      expectedPrice: totalPrice != undefined ?
      Math.round(totalPrice / (peopleBefore + form.getFieldValue("peopleNum"))) : undefined
    });
  };
  
  async function getParties() {
    await axios.get("parties/" + card._id)
      .then(res => {
        setParties(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  async function getComments() {
    await axios.get("comments/" + card._id)
      .then(res => {
        setComments(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  async function onCommentSubmit() {
      let body = {
          postId: card._id,
          content: text,
          intraId: "defualt"
      };
      await axios.post("comments/", body);
      setText("");
      getComments();
  }

  function onTextChange(e : any) {
      setText(e.target.value);
      console.log(e.target.value);
  }

  return (
          <Collapse onChange={getParties}>
              <Panel header={card.title} key="1" showArrow={false}
              extra={<span>{"메뉴: " + card.menu + " "} <UserOutlined /> {card.currentPeople} / {card.maxPeople}</span>}>
                  <Space style={{display: "flex", justifyContent: "space-between"}} direction="horizontal">
                      <p>추가 정보:</p>
                      <Button type="primary" onClick={showModal}>
                          그룹에 참여하기
                      </Button>
                      <Modal open={isModalOpen} onOk={postParty} onCancel={handleCancel}>
                          <h1 className={styles.title}>파티 추가</h1>
                          <div style={{textAlign:'right', paddingRight:'20%'}}>
                              예상 배달 팁: {totalPrice}/{peopleNum}={expectedPrice}원
                          </div>
                          <Form
                          {...layout}
                          form={form}
                          name="control-hooks"
                          initialValues={{
                              ["joinable"]: false,
                              ["peopleNum"]: 1
                          }}
                          className={styles.form}
                          >
                          <Form.Item name="partyTitle" label="파티 이름" rules={[{ required: true }]}>
                              <Input placeholder='파티 이름을 적어주세요'/>
                          </Form.Item>
                          <Form.Item name="joinable" rules={[{ required: false }]} valuePropName="checked">
                              <Checkbox defaultChecked={false}>따로 먹을게요</Checkbox>
                          </Form.Item>
                          <Form.Item name="peopleNum" label="파티 인원" rules={[{ required: true }]}>
                              <InputNumber min={1} max={maxP} onChange={onChange} />
                          </Form.Item>
                          </Form>
                      </Modal>
                  </Space>
                  <p style={{wordBreak: "break-all"}}>{card.content}</p>
                  <Table columns={columns} rowKey={"_id"} dataSource={parties} pagination={false}/>
              <Collapse ghost onChange={getComments}>
                  <Panel header="댓글 창" key="2">
                      {comments.map(comment => (
                          <UserComment comment={comment} key={comment._id}/>
                      ))}
                      <Space.Compact block>
                          <TextArea placeholder="100자 제한" maxLength={100} onChange={onTextChange}/>
                          <Button type="primary" onClick={onCommentSubmit}>작성</Button>
                      </Space.Compact>
                  </Panel>
              </Collapse>

              </Panel>

          </Collapse>
  );
}

const Main: React.FC = () => {
  const [switchValue, setSwitchValue] = useState(true);    
  const [availableCard, setAvailableCard] = useState(Array());
  const [unavailableCard, setUnavailableCard] = useState(Array());

  const [nickname, setNickname] = useRecoilState(nicknameState);
  const router = useRouter();

  function logOutHandler(){
    logOut(router);
  }

  const items: MenuProps['items'] = [
    {
      label: <p>logout</p>,
      key: '0',
      danger: true,
      onClick: logOutHandler,
    },
  ];

  useEffect(() => {
    if (Cookies.get('accessToken')) {
        console.log('in Main');
        getData();
    }
    setCookieFromCode(router);
    async function getData(){
      const result = await getNicknameFromToken();
      setNickname(result);
    }
  }, []);

  const handleSwitchChange = (checked: boolean) => {
      setSwitchValue(checked);
  };

  let aCard = Array();
  let uCard = Array();
  let cards = Array();

  const getCards = async () => {
    await axios.get("/posts", {withCredentials: true})
      .then(res => {
        cards = res.data;
        cards.map(c => (
            c.available ? aCard.push(c) : uCard.push(c)
        ));
        setAvailableCard(aCard);
        setUnavailableCard(uCard);
      })
      .catch(err => {
        console.log(err);
      });
  }
  getCards();
  
  return (
      <>
      <Header className={styles.headerStyle}>
          <Space className={styles.headerSpace}direction="horizontal">
              <Button href="/group" icon={<FormOutlined />}>글 쓰기</Button>
              <Switch checkedChildren="모집 중" unCheckedChildren="마감" defaultChecked={true} onChange={handleSwitchChange}/>
              <Dropdown menu={{ items }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        {nickname ? nickname : "Click me"}
                      </Space>
                  </a>
              </Dropdown>
          </Space>
      </Header>
      <FloatButton icon={<FormOutlined />} tooltip={<div>그룹 생성하기</div>} 
      shape="square" type="primary" href="/group" description="그룹 생성"/>
      <div className={styles.pad}>
          {switchValue ? availableCard.map(card => (<UserCard card={card} key={card._id}/>))
          : unavailableCard.map(card => (<UserCard card={card} key={card._id}/>))}
      </div>
      </>
      );
}

export default withAuth(Main);