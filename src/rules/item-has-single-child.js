export const meta = {
  type: "problem",
  hasSuggestions: true,
  fixable: true,
};

export default (context) => {
  const scope = {
    formLocalName: null,
    itemLocalName: null,
  };

  const isFormItem = (nameNode) => {
    if (scope.formLocalName) {
      switch (nameNode.type) {
        case "JSXMemberExpression":
          return (
            nameNode.object.name === scope.formLocalName &&
            nameNode.property.name === "Item"
          );

        case "JSXIdentifier":
          return nameNode.name === scope.itemLocalName;
      }
    } else {
      return false;
    }
  };

  return {
    ImportDeclaration: (node) => {
      if (node.source.value === "antd") {
        const form = node.specifiers.find(
          (spec) => spec.imported.name === "Form"
        );
        if (form) {
          scope.formLocalName = form.local.name;
        }
      }
    },
    VariableDeclaration: (node) => {
      if (scope.formLocalName && node.kind === "const") {
        const formDeref = node.declarations.find(
          (dec) => dec.init.name === scope.formLocalName
        );
        if (formDeref) {
          const itemAssign = formDeref.id.properties.find(
            (prop) => prop.key.name === "Item"
          );
          if (itemAssign) {
            scope.itemLocalName = itemAssign.value.name;
            console.log(scope.itemLocalName);
          }
        }
      }
    },
    JSXElement: (node) => {
      const tagName = node.openingElement.name;

      if (isFormItem(tagName)) {
        const jsxChildren = node.children.filter(
          (child) => child.type === "JSXElement"
        );
        if (jsxChildren.length > 1) {
          context.report({
            node,
            message: "Multiple children of FormItem",
          });
        }
      }
    },
  };
};
