self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "rootMainFilesTree": {},
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/favoritos": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/favoritos.js"
    ],
    "/pokemon/[id]": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/pokemon/[id].js"
    ],
    "/regioes": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/regioes.js"
    ],
    "/tipos": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/tipos.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];