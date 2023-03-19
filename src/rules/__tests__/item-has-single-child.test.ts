import { RuleTester } from "@typescript-eslint/utils/dist/eslint-utils";

import rule from "../item-has-single-child";

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  parser: "@typescript-eslint/parser",
});

ruleTester.run("form-item-has-single-child", rule, {
  valid: [
    `
import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';

export const App: React.FC = () => (
  <Form
    name="basic">
    <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>
</Form>);
`,
    `
import React from 'react';
import { Button, Checkbox, Form as MyForm, Input } from 'antd';
const {Item: MyItem} = MyForm;

export const App: React.FC = () => (
  <Form
    name="basic">
    <MyItem
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </MyItem>
</Form>);
`,
  ],
  invalid: [
    {
      code: `
import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';

export const App: React.FC = () => (
  <Form
    name="basic">
    <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input /><Input />
    </Form.Item>
</Form>);
`,
      errors: [{ messageId: "multipleJSXChildrenDetected" }],
    },
    {
      code: `
import React from 'react';
import { Button, Checkbox, Form as MyForm, Input } from 'antd';
const {Item: MyItem} = MyForm;

export const App: React.FC = () => (
  <Form
    name="basic">
    <MyItem
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input /><Input />
    </MyItem>
</Form>);
`,
      errors: [{ messageId: "multipleJSXChildrenDetected" }],
    },
  ],
});
