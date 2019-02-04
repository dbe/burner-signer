import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve'


export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  name: 'MyModule',
  plugins: [
    resolve(),
    commonjs({
      namedExports: {'node_modules/ethers/index.js': [ 'Wallet' ]}
    }),
    json()
  ]
};
