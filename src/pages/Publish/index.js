import {
  Card,
  Radio,
  Upload,
  Breadcrumb,
  Form,
  Button,
  message,
  Input,
  Space,
  Select,
} from "antd";
import { Link } from "react-router-dom";
import "./index.scss";
import TinyMCEEditor from "@/components/TinyMCEEditor";
import { useState, useEffect, useRef } from "react";
import { request } from "@/utils";
import { PlusOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const Publish = () => {
  const navagite = useNavigate();
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("id");
  const [form] = Form.useForm();
  useEffect(() => {
    async function getArticle() {
      const res = await request.get(`/mp/articles/${articleId}`);
      const { cover, ...formValue } = res.data;
      // 设置表单数据
      form.setFieldsValue({ ...formValue, type: cover.type });
      // 2. 回填封面图片
      setImageType(cover.type); // 封面类型
      setImageList(cover.images.map((url) => ({ url }))); // 封面list
    }
    if (articleId) {
      // 拉取数据回显
      getArticle();
    }
  }, [articleId, form]);
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    async function fetchChannels() {
      const res = await request.get("/channels");
      setChannels(res.data.channels);
    }
    fetchChannels();
  }, []);
  // 发布文章
  // 发布文章
  const onFinish = async (formValue) => {
    const { channel_id, content, title } = formValue;
    const formatUrl = (list) => {
      return list.map((item) => {
        if (item.response) {
          return item.response.data.url;
        } else {
          return item.url;
        }
      });
    };
    const data = {
      channel_id,
      content,
      title,
      type: imageType,
      cover: {
        type: imageType,
        images: formatUrl(imageList),
      },
    };
    data.content = "xxx";
    if (imageType !== imageList.length)
      return message.warning("图片类型和数量不一致");
    if (articleId) {
      // 编辑
      await request.put(`/mp/articles/${articleId}?draft=false`, data);
    } else {
      // 新增
      await request.post("/mp/articles?draft=false", data);
    }
    message.success(`${articleId ? "编辑" : "发布"}文章成功`);
    navagite("/article");
  };
  const cacheImageList = useRef([]);
  const [imageList, setImageList] = useState([]);
  const onUploadChange = (val) => {
    setImageList(val.fileList);
    cacheImageList.current = val.fileList;
  };
  const [imageType, setImageType] = useState(0);
  const onTypeChange = (e) => {
    console.log("e", e);
    const type = e.target.value;
    setImageType(type);
    if (imageType === 1) {
      const oneImageList = cacheImageList.current[0]
        ? cacheImageList.current[0]
        : [];
      setImageList(oneImageList);
    } else if (imageType === 3) {
      setImageList(cacheImageList.current);
    }
  };
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={"/"}>首页</Link> },
              { title: `${articleId ? "编辑文章" : "发布文章"}` },
            ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1 }}
          onFinish={onFinish}
          form={form}
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
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imageType > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                showUploadList
                action={"http://geek.itheima.net/v1_0/upload"}
                onChange={onUploadChange}
                maxCount={imageType}
                multiple={imageType > 1}
                fileList={imageList}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;
