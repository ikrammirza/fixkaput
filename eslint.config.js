const config = [
  // Extending ESLint recommended configuration
  {
    languageOptions: {
      globals: {
        browser: true,
        es2021: true,
      },
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
      },
    },
    rules: {
      'no-console': 'warn',
      'react/react-in-jsx-scope': 'off',
    },
  },
  
  // Extending React recommended configuration
  {
    files: ['**/*.jsx', '**/*.js'],
    languageOptions: {
      parser: '@babel/eslint-parser', // Make sure you have this parser installed
      globals: {
        React: 'readonly', // You might want to define React as a global variable
      },
      plugins: {
        react: require('eslint-plugin-react'),
      },
    },
    
  },
  
  // Extending Next.js core web vitals
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      plugins: {
        next: require('eslint-plugin-next'),
      },
    },
  },
];

module.exports = config;
