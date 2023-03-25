Collection of eslint rules for ANT Design
=========================================



form-item-has-single-child
--------------------------

Ensuring that `Form.Item` elements contain exactly one child

Form items are essentialy the wrappers for input controls, to connect them to the form's context, using the `cloneElement` under the hood. To make it happen, input control must be the only (and direct) child of form item, in [all other cases](https://stackblitz.com/edit/react-56ppz3) form item just does not work, without even warnings in run time. ou may occsionally add an extra child element, for the UI purposes, and break your form..

Examples of **incorrect** code for this rule:
```JavaScript
    <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
      <label>Fancy but harmful</label>
    </Form.Item>
```

```JavaScript
    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <label>Fancy and harmful</label>
      <Input.Password />
    </Form.Item>
```


Examples of **correct** code for this rule:
```JavaScript
    <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>
```

This rule has no options.
