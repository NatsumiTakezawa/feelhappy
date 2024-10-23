// .eslintrc.js
module.exports = {
    "env": {
      "browser": true,
      "es2021": true,
      "node": true
    },
    "extends": [
      "react-app",  // Create React Appの基本設定を継承
    ],
    "rules": {
      "no-octal-escape": "off",
      "max-len": "off"
    },
    "ignorePatterns": ["*-normal.js", "*.font.js"],
    "overrides": [
      {
        "files": ["*-normal.js", "*.font.js"],
        "rules": {
          "no-octal-escape": "off"
        }
      }
    ]
  }