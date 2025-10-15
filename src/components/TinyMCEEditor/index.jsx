import React, { useState, useEffect } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import { tinymceConfig } from '@/utils/tinymceConfig';
import './index.scss';

const TinyMCEEditorComponent = ({ value = '', onChange }) => {
  // 用于内部状态管理，确保编辑器能够正确响应外部value变化
  const [editorContent, setEditorContent] = useState(value);

  // 当外部value变化时更新编辑器内容
  useEffect(() => {
    setEditorContent(value);
  }, [value]);

  // 处理编辑器内容变化
  const handleEditorChange = (content, editor) => {
    setEditorContent(content);
    if (onChange) {
      onChange(content);
    }
  };

  // 自定义配置，扩展基础配置
  const customConfig = {
    ...tinymceConfig,
    height: 400,
    menubar: 'file edit view insert format tools table help',
    plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    content_css: 'default',
    setup: (editor) => {
      // 可以在这里添加自定义事件处理
      editor.on('init', () => {
        console.log('TinyMCE 编辑器初始化完成');
      });
    }
  };

  return (
    <div className="tiny-mce-editor">
      <TinyMCEEditor
        value={editorContent}
        onEditorChange={handleEditorChange}
        init={customConfig}
        apiKey="no-api-key"
      />
    </div>
  );
};

export default TinyMCEEditorComponent;