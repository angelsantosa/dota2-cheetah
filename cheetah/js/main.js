var commands_json = "/cheetah/fixtures/commands.json";
var Views = {
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
    template: "templates/main.html",
    data: {}
  },
  "cat":{
    tagname: "cat",
    el: $("#cat"),
    template: "",
    data:{}
  }
}
var cats_nested, cats_json;
var Header = new CheetahTplManager(Views.header);
var StatusBar = new CheetahTplManager(Views.footer);
var CatMenu = new CheetahTplManager(Views.main);
var CommandList = new CheetahJSONManager(commands_json);


$(document).ready(function() {
  //render headerd and status bar
  //.commands{.name == "gold" }
  cats_nested = CommandList.getNestedObject(".categories");
  cats_json = CommandList.objToJSON(cats_nested);

  Header.render();
  StatusBar.render();
  CatMenu.renderData(cats_nested);

});
