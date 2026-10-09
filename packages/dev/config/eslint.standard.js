// Copyright 2017-2026 @pezkuwi/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

// The rules of eslint-config-standard 17.1.0 (MIT, Copyright Feross Aboukhadijeh,
// https://github.com/standard/eslint-config-standard), carried here once and with
// the same options, so the lint stays what it was: that package is written for
// eslint 8. Its formatting rules are deprecated in eslint core and continue in
// @stylistic under the same names (func-call-spacing is function-call-spacing
// there). no-new-object and no-new-symbol, deprecated too, are no-object-constructor
// and no-new-native-nonconstructor here; import/* is import-x/*.

export const standardRules = {
  '@stylistic/array-bracket-spacing': [
    'error',
    'never'
  ],
  '@stylistic/arrow-spacing': [
    'error',
    {
      after: true,
      before: true
    }
  ],
  '@stylistic/block-spacing': [
    'error',
    'always'
  ],
  '@stylistic/brace-style': [
    'error',
    '1tbs',
    {
      allowSingleLine: true
    }
  ],
  '@stylistic/comma-dangle': [
    'error',
    {
      arrays: 'never',
      exports: 'never',
      functions: 'never',
      imports: 'never',
      objects: 'never'
    }
  ],
  '@stylistic/comma-spacing': [
    'error',
    {
      after: true,
      before: false
    }
  ],
  '@stylistic/comma-style': [
    'error',
    'last'
  ],
  '@stylistic/computed-property-spacing': [
    'error',
    'never',
    {
      enforceForClassMembers: true
    }
  ],
  '@stylistic/dot-location': [
    'error',
    'property'
  ],
  '@stylistic/eol-last': 'error',
  '@stylistic/function-call-spacing': [
    'error',
    'never'
  ],
  '@stylistic/generator-star-spacing': [
    'error',
    {
      after: true,
      before: true
    }
  ],
  '@stylistic/indent': [
    'error',
    2,
    {
      ArrayExpression: 1,
      CallExpression: {
        arguments: 1
      },
      FunctionDeclaration: {
        body: 1,
        parameters: 1
      },
      FunctionExpression: {
        body: 1,
        parameters: 1
      },
      ImportDeclaration: 1,
      MemberExpression: 1,
      ObjectExpression: 1,
      SwitchCase: 1,
      VariableDeclarator: 1,
      flatTernaryExpressions: false,
      ignoreComments: false,
      ignoredNodes: [
        'TemplateLiteral *',
        'JSXElement',
        'JSXElement > *',
        'JSXAttribute',
        'JSXIdentifier',
        'JSXNamespacedName',
        'JSXMemberExpression',
        'JSXSpreadAttribute',
        'JSXExpressionContainer',
        'JSXOpeningElement',
        'JSXClosingElement',
        'JSXFragment',
        'JSXOpeningFragment',
        'JSXClosingFragment',
        'JSXText',
        'JSXEmptyExpression',
        'JSXSpreadChild'
      ],
      offsetTernaryExpressions: true,
      outerIIFEBody: 1
    }
  ],
  '@stylistic/key-spacing': [
    'error',
    {
      afterColon: true,
      beforeColon: false
    }
  ],
  '@stylistic/keyword-spacing': [
    'error',
    {
      after: true,
      before: true
    }
  ],
  '@stylistic/lines-between-class-members': [
    'error',
    'always',
    {
      exceptAfterSingleLine: true
    }
  ],
  '@stylistic/multiline-ternary': [
    'error',
    'always-multiline'
  ],
  '@stylistic/new-parens': 'error',
  '@stylistic/no-extra-parens': [
    'error',
    'functions'
  ],
  '@stylistic/no-floating-decimal': 'error',
  '@stylistic/no-mixed-operators': [
    'error',
    {
      allowSamePrecedence: true,
      groups: [
        [
          '==',
          '!=',
          '===',
          '!==',
          '>',
          '>=',
          '<',
          '<='
        ],
        [
          '&&',
          '||'
        ],
        [
          'in',
          'instanceof'
        ]
      ]
    }
  ],
  '@stylistic/no-mixed-spaces-and-tabs': 'error',
  '@stylistic/no-multi-spaces': 'error',
  '@stylistic/no-multiple-empty-lines': [
    'error',
    {
      max: 1,
      maxBOF: 0,
      maxEOF: 0
    }
  ],
  '@stylistic/no-tabs': 'error',
  '@stylistic/no-trailing-spaces': 'error',
  '@stylistic/no-whitespace-before-property': 'error',
  '@stylistic/object-curly-newline': [
    'error',
    {
      consistent: true,
      multiline: true
    }
  ],
  '@stylistic/object-curly-spacing': [
    'error',
    'always'
  ],
  // allowMultiplePropertiesPerLine was core's alias for allowAllPropertiesOnSameLine
  // (the two were OR-ed); @stylistic only takes the latter.
  '@stylistic/object-property-newline': [
    'error',
    {
      allowAllPropertiesOnSameLine: true
    }
  ],
  '@stylistic/operator-linebreak': [
    'error',
    'after',
    {
      overrides: {
        ':': 'before',
        '?': 'before',
        '|>': 'before'
      }
    }
  ],
  '@stylistic/padded-blocks': [
    'error',
    {
      blocks: 'never',
      classes: 'never',
      switches: 'never'
    }
  ],
  '@stylistic/quote-props': [
    'error',
    'as-needed'
  ],
  '@stylistic/quotes': [
    'error',
    'single',
    {
      allowTemplateLiterals: 'never',
      avoidEscape: true
    }
  ],
  '@stylistic/rest-spread-spacing': [
    'error',
    'never'
  ],
  '@stylistic/semi': [
    'error',
    'never'
  ],
  '@stylistic/semi-spacing': [
    'error',
    {
      after: true,
      before: false
    }
  ],
  '@stylistic/space-before-blocks': [
    'error',
    'always'
  ],
  '@stylistic/space-before-function-paren': [
    'error',
    'always'
  ],
  '@stylistic/space-in-parens': [
    'error',
    'never'
  ],
  '@stylistic/space-infix-ops': 'error',
  '@stylistic/space-unary-ops': [
    'error',
    {
      nonwords: false,
      words: true
    }
  ],
  '@stylistic/spaced-comment': [
    'error',
    'always',
    {
      block: {
        balanced: true,
        exceptions: [
          '*'
        ],
        markers: [
          '*package',
          '!',
          ',',
          ':',
          '::',
          'flow-include'
        ]
      },
      line: {
        markers: [
          '*package',
          '!',
          '/',
          ',',
          '='
        ]
      }
    }
  ],
  '@stylistic/template-curly-spacing': [
    'error',
    'never'
  ],
  '@stylistic/template-tag-spacing': [
    'error',
    'never'
  ],
  '@stylistic/wrap-iife': [
    'error',
    'any',
    {
      functionPrototypeMethods: true
    }
  ],
  '@stylistic/yield-star-spacing': [
    'error',
    'both'
  ],
  'accessor-pairs': [
    'error',
    {
      enforceForClassMembers: true,
      setWithoutGet: true
    }
  ],
  'array-callback-return': [
    'error',
    {
      allowImplicit: false,
      checkForEach: false
    }
  ],
  camelcase: [
    'error',
    {
      allow: [
        '^UNSAFE_'
      ],
      ignoreGlobals: true,
      properties: 'never'
    }
  ],
  'constructor-super': 'error',
  curly: [
    'error',
    'multi-line'
  ],
  'default-case-last': 'error',
  'dot-notation': [
    'error',
    {
      allowKeywords: true
    }
  ],
  eqeqeq: [
    'error',
    'always',
    {
      null: 'ignore'
    }
  ],
  'import-x/export': 'error',
  'import-x/first': 'error',
  'import-x/no-absolute-path': [
    'error',
    {
      amd: false,
      commonjs: true,
      esmodule: true
    }
  ],
  'import-x/no-duplicates': 'error',
  'import-x/no-named-default': 'error',
  'import-x/no-webpack-loader-syntax': 'error',
  'n/handle-callback-err': [
    'error',
    '^(err|error)$'
  ],
  'n/no-callback-literal': 'error',
  'n/no-deprecated-api': 'error',
  'n/no-exports-assign': 'error',
  'n/no-new-require': 'error',
  'n/no-path-concat': 'error',
  'n/process-exit-as-throw': 'error',
  'new-cap': [
    'error',
    {
      capIsNew: false,
      newIsCap: true,
      properties: true
    }
  ],
  'no-array-constructor': 'error',
  'no-async-promise-executor': 'error',
  'no-caller': 'error',
  'no-case-declarations': 'error',
  'no-class-assign': 'error',
  'no-compare-neg-zero': 'error',
  'no-cond-assign': 'error',
  'no-const-assign': 'error',
  'no-constant-condition': [
    'error',
    {
      checkLoops: false
    }
  ],
  'no-control-regex': 'error',
  'no-debugger': 'error',
  'no-delete-var': 'error',
  'no-dupe-args': 'error',
  'no-dupe-class-members': 'error',
  'no-dupe-keys': 'error',
  'no-duplicate-case': 'error',
  'no-empty': [
    'error',
    {
      allowEmptyCatch: true
    }
  ],
  'no-empty-character-class': 'error',
  'no-empty-pattern': 'error',
  'no-eval': 'error',
  'no-ex-assign': 'error',
  'no-extend-native': 'error',
  'no-extra-bind': 'error',
  'no-extra-boolean-cast': 'error',
  'no-fallthrough': 'error',
  'no-func-assign': 'error',
  'no-global-assign': 'error',
  'no-implied-eval': 'error',
  'no-import-assign': 'error',
  'no-invalid-regexp': 'error',
  'no-irregular-whitespace': 'error',
  'no-iterator': 'error',
  'no-labels': [
    'error',
    {
      allowLoop: false,
      allowSwitch: false
    }
  ],
  'no-lone-blocks': 'error',
  'no-loss-of-precision': 'error',
  'no-misleading-character-class': 'error',
  'no-multi-str': 'error',
  'no-new': 'error',
  'no-new-func': 'error',
  'no-new-native-nonconstructor': 'error',
  'no-new-wrappers': 'error',
  'no-obj-calls': 'error',
  'no-object-constructor': 'error',
  'no-octal': 'error',
  'no-octal-escape': 'error',
  'no-proto': 'error',
  'no-prototype-builtins': 'error',
  'no-redeclare': [
    'error',
    {
      builtinGlobals: false
    }
  ],
  'no-regex-spaces': 'error',
  'no-return-assign': [
    'error',
    'except-parens'
  ],
  'no-self-assign': [
    'error',
    {
      props: true
    }
  ],
  'no-self-compare': 'error',
  'no-sequences': 'error',
  'no-shadow-restricted-names': 'error',
  'no-sparse-arrays': 'error',
  'no-template-curly-in-string': 'error',
  'no-this-before-super': 'error',
  'no-throw-literal': 'error',
  'no-undef': 'error',
  'no-undef-init': 'error',
  'no-unexpected-multiline': 'error',
  'no-unmodified-loop-condition': 'error',
  'no-unneeded-ternary': [
    'error',
    {
      defaultAssignment: false
    }
  ],
  'no-unreachable': 'error',
  'no-unreachable-loop': 'error',
  'no-unsafe-finally': 'error',
  'no-unsafe-negation': 'error',
  'no-unused-expressions': [
    'error',
    {
      allowShortCircuit: true,
      allowTaggedTemplates: true,
      allowTernary: true
    }
  ],
  'no-unused-vars': [
    'error',
    {
      args: 'none',
      caughtErrors: 'none',
      ignoreRestSiblings: true,
      vars: 'all'
    }
  ],
  'no-use-before-define': [
    'error',
    {
      classes: false,
      functions: false,
      variables: false
    }
  ],
  'no-useless-backreference': 'error',
  'no-useless-call': 'error',
  'no-useless-catch': 'error',
  'no-useless-computed-key': 'error',
  'no-useless-constructor': 'error',
  'no-useless-escape': 'error',
  'no-useless-rename': 'error',
  'no-useless-return': 'error',
  'no-var': 'warn',
  'no-void': 'error',
  'no-with': 'error',
  'object-shorthand': [
    'warn',
    'properties'
  ],
  'one-var': [
    'error',
    {
      initialized: 'never'
    }
  ],
  'prefer-const': [
    'error',
    {
      destructuring: 'all'
    }
  ],
  'prefer-promise-reject-errors': 'error',
  'prefer-regex-literals': [
    'error',
    {
      disallowRedundantWrapping: true
    }
  ],
  'promise/param-names': 'error',
  'symbol-description': 'error',
  'unicode-bom': [
    'error',
    'never'
  ],
  'use-isnan': [
    'error',
    {
      enforceForIndexOf: true,
      enforceForSwitchCase: true
    }
  ],
  'valid-typeof': [
    'error',
    {
      requireStringLiterals: true
    }
  ],
  yoda: [
    'error',
    'never'
  ]
};
