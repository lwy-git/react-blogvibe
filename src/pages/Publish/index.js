import { Card,Radio, Upload, Breadcrumb, Form, Button, message,Input, Space, Select } from "antd";
import { Link } from "react-router-dom";
import "./index.scss";
import TinyMCEEditor from "@/components/TinyMCEEditor";
import { useState, useEffect } from "react";
import { request } from "@/utils";
import { PlusOutlined } from "@ant-design/icons";
const { Option } = Select;

const Publish = () => {
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    async function fetchChannels() {
      const res = await request.get("/channels");
      setChannels(res.data.channels);
    }
    fetchChannels();
  }, []);
  // 发布文章
const onFinish = async (formValue) => {
  const { channel_id, content, title } = formValue
  const params = {
    channel_id,
    content,
    title,
    type: 1,
    cover: {
      type: 1,
      images: []
    }
  }
  params.content='xxx'
   try {
    await request.post('/mp/articles?draft=false', params)
    message.success('发布文章成功')  // 使用简单的字符串形式
    console.log('发布成功')  // 添加日志以便调试
  } catch (error) {
    console.error('发布失败:', error)  // 捕获并打印错误
    message.error('发布失败，请重试')  // 显示错误提示
  }
}
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={"/"}>首页</Link> },
              { title: "发布文章" },
            ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1 }}
          onFinish={onFinish}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: "请选择文章频道" }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              <Option value={0}>推荐</Option>
              {channels.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            getValueFromEvent={(value) => value}
          >
            <TinyMCEEditor />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
          <Form.Item label="封面">
  <Form.Item name="type">
    <Radio.Group>
      <Radio value={1}>单图</Radio>
      <Radio value={3}>三图</Radio>
      <Radio value={0}>无图</Radio>
    </Radio.Group>
  </Form.Item>
  <Upload
    listType="picture-card"
    showUploadList
  >
    <div style={{ marginTop: 8 }}>
      <PlusOutlined />
    </div>
  </Upload>
</Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;
