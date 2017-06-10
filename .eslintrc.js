module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "rules": {
      "max-len": [1, 120, 2, {ignoreComments: true}],
      "quote-props": [1, "consistent-as-needed"],
      "radix": 0,
      "space-infix-ops": 0,
      "no-unused-vars": [1, {"vars": "local", "args": "none"}],
      "no-else-return": 0
    }
};