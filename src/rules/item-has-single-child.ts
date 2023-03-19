import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import type { TSESTree } from "@typescript-eslint/utils";

import { ANTD_FORM_ITEM_NAME, ANTD_FORM_NAME, ANTD_PKG_NAME } from "../meta";
import { createRule } from "../utils";

type MessageIds = "multipleJSXChildrenDetected";

export default createRule<[], MessageIds>({
  name: "form-item-has-single-child",
  meta: {
    type: "problem",
    hasSuggestions: false,
    docs: {
      description: "Ensuring that form items have exactly one child node",
      recommended: "strict",
    },
    fixable: "code",
    messages: {
      multipleJSXChildrenDetected: "Multiple children of FormItem",
    },

    schema: { $defs: {} },
  },
  defaultOptions: [],
  create: (context) => {
    const scope: Record<string, string | null> = {
      formLocalName: null,
      itemLocalName: null,
    };

    const isFormItem = (nameNode: TSESTree.JSXTagNameExpression) => {
      if (scope.formLocalName) {
        switch (nameNode.type) {
          case AST_NODE_TYPES.JSXMemberExpression:
            return (
              (nameNode.object as TSESTree.JSXIdentifier).name ===
                scope.formLocalName &&
              nameNode.property.name === ANTD_FORM_ITEM_NAME
            );

          case AST_NODE_TYPES.JSXIdentifier:
            return nameNode.name === scope.itemLocalName;
        }
      } else {
        return false;
      }
    };

    return {
      [AST_NODE_TYPES.ImportDeclaration]: (
        node: TSESTree.ImportDeclaration
      ) => {
        if (node.source.value === ANTD_PKG_NAME) {
          const form = node.specifiers
            .filter((clause) => clause.type === AST_NODE_TYPES.ImportSpecifier)
            .find(
              (spec) =>
                (spec as TSESTree.ImportSpecifier).imported.name ===
                ANTD_FORM_NAME
            );
          if (form) {
            scope.formLocalName = form.local.name;
          }
        }
      },
      [AST_NODE_TYPES.VariableDeclaration]: (
        node: TSESTree.VariableDeclaration
      ) => {
        if (scope.formLocalName && node.kind === "const") {
          const formDeref = node.declarations.find(
            (dec) =>
              dec.init?.type === AST_NODE_TYPES.Identifier &&
              dec.init.name === scope.formLocalName
          );
          if (formDeref) {
            const itemAssign =
              formDeref.id.type === AST_NODE_TYPES.ObjectPattern &&
              (
                formDeref.id.properties.filter(
                  (prop) =>
                    prop.type === AST_NODE_TYPES.Property && prop.computed
                ) as TSESTree.PropertyComputedName[]
              ).find(
                (prop) =>
                  prop.key.type === AST_NODE_TYPES.Identifier &&
                  prop.key.name === "Item"
              );

            if (
              itemAssign &&
              itemAssign.value?.type === AST_NODE_TYPES.Identifier
            ) {
              scope.itemLocalName = itemAssign.value.name;
            }
          }
        }
      },
      [AST_NODE_TYPES.JSXElement]: (node: TSESTree.JSXElement) => {
        const tagName = node.openingElement.name;

        if (isFormItem(tagName)) {
          const jsxChildren = node.children.filter(
            (child) => child.type === AST_NODE_TYPES.JSXElement
          );

          if (jsxChildren.length > 1) {
            context.report({
              node,
              messageId: "multipleJSXChildrenDetected",
            });
          }
        }
      },
    };
  },
});
