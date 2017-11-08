var templates = {
  "header": {
    tagname: "header",
    el: $("header"),
    template: "templates/header.html",
    data: {
      title : "Cheetah!",
      version : 0.1
    }
  },
  "footer": {
    tagname: "footer",
    el : $("footer"),
    template: "templates/footer.html",
    data: {
      msg: "Loaded correctly",
      status: "ok",
    }
  },
  "main": {
    tagname: "main",
    el: $("main"),
    template: "template/main.html",
    data: {}
  }
}
var Header = new CheetahTplManager(templates.header);
var StatusBar = new CheetahTplManager(templates.footer);
Header.render();
StatusBar.render();
