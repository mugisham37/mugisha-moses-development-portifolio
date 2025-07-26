/** @type {import('stylelint').Config} */
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order'
  ],
  plugins: [
    'stylelint-order'
  ],
  rules: {
    // Allow vendor prefixes without standard properties in some cases
    'property-no-vendor-prefix': null,
    
    // Require standard properties when vendor prefixes are used
    'declaration-block-no-redundant-longhand-properties': true,
    
    // Allow unknown properties for experimental features
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          // Allow experimental properties
          'print-color-adjust',
          'color-adjust'
        ]
      }
    ],
    
    // Vendor prefix rules
    'at-rule-no-vendor-prefix': true,
    'media-feature-name-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    
    // Order rules for better maintainability
    'order/order': [
      'custom-properties',
      'declarations'
    ],
    
    'order/properties-alphabetical-order': null,
    
    // Allow empty rules for media queries
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment']
      }
    ],
    
    // Custom rules for print styles
    'media-query-no-invalid': true,
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment']
      }
    ],
    
    // Allow important declarations in print styles
    'declaration-no-important': null,
    
    // Allow universal selector in print styles (necessary for resets)
    'selector-max-universal': null,
    
    // Allow import statements (needed for modular CSS)
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'import',
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen'
        ]
      }
    ],
    
    // Color rules
    'color-no-invalid-hex': true,
    'color-hex-length': 'short',
    
    // Font rules
    'font-family-no-duplicate-names': true,
    'font-family-no-missing-generic-family-keyword': true,
    
    // Unit rules
    'unit-no-unknown': true,
    'length-zero-no-unit': true,
    
    // String rules
    'string-no-newline': true,
    
    // Function rules
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    
    // Number rules
    'number-no-trailing-zeros': true,
    
    // Selector rules
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': true,
    
    // Comment rules
    'comment-no-empty': true,
    
    // General rules
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': true,
    'no-empty-source': true,
    'no-invalid-double-slash-comments': true
  },
  
  // Override rules for specific file patterns
  overrides: [
    {
      files: ['**/print*.css'],
      rules: {
        // More lenient rules for print CSS files
        'selector-max-universal': null,
        'at-rule-no-unknown': null,
        'property-no-vendor-prefix': null,
        'declaration-no-important': null,
        'selector-max-specificity': null,
        'max-nesting-depth': null
      }
    },
    {
      files: ['**/*.css'],
      rules: {
        // More lenient rules for CSS files
        'at-rule-no-unknown': [
          true,
          {
            ignoreAtRules: [
              'import',
              'tailwind',
              'apply',
              'variants',
              'responsive',
              'screen'
            ]
          }
        ]
      }
    }
  ],
  
  // Ignore certain files
  ignoreFiles: [
    'node_modules/**/*',
    'dist/**/*',
    'build/**/*',
    '.next/**/*'
  ]
};
