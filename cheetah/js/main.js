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
var cats_nested;
var Header = new CheetahTplManager(Views.header);
var StatusBar = new CheetahTplManager(Views.footer);
var CatMenu = new CheetahTplManager(Views.main);
var CatContainer = new CheetahTplManager(Views.cat);
var CommandList = new CheetahJSONManager(commands_json);

$(document).ready(function() {
  //render headerd and status bar
  Header.render();
  StatusBar.render();
  //get cat of commands
  var cats_nested = CommandList.getNestedObject("categories");
  setTimeout(function () {
    var cats_nested = JSON.stringify(cats_nested)
  }, 10);
  setTimeout(function () {
    //render cats with their info, note that could have just been itarated, class getNestedObject() gives me the power
    //of template one by one, which is gonna be needed  for createing items and units, ill fix it when i get wiht a better idea
    CatMenu.renderData(cats_nested);
  }, 20);



});
