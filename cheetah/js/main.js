var commands_json = "/cheetah/fixtures/commands.json";
var heroes_json = "/cheetah/fixtures/heroes_merge.json";
var Views = {
  "header": {
    tagname: "header",
    el: $("header"),
    template: "templates/header.html",
    data: {
      title: "Cheetah!",
      version: 0.1
    }
  },
  "footer": {
    tagname: "footer",
    el: $("footer"),
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
  "cat": {
    tagname: "cat",
    el: $("#cat"),
    template: "",
    data: {}
  }
}

var cats_nested, cats_json;
//viws
var Header = new CheetahTplManager(Views.header);
var StatusBar = new CheetahTplManager(Views.footer);
var CatMenu = new CheetahTplManager(Views.main);
//data
var CommandData = new CheetahJSONManager(commands_json);
var HeroData = new CheetahJSONManager(heroes_json);


$(document).ready(function() {

  cats_nested = CommandData.getNestedObject(".categories");
  cats_json = objToJSON(cats_nested);
  Header.render();
  StatusBar.render();
  CatMenu.renderData(cats_nested);

});

$(document).on("click", "#cat", function() {

  var catname = $(this).attr('cat');
  var catid = $(this).attr('catid');
  var commands_in_cat = CommandData.getNestedObject('.commands{.cat == ' + catid + '}');

  Views.cat = {
    tagname: "cateiner",
    el: $("#cateiner"),
    template: "templates/" + catname + ".html",
    data: {
      cat: {
        id: catid,
        name: catname
      },
      commands: commands_in_cat
    }
  }
  var CatContainer = new CheetahTplManager(Views.cat);

  var heroes_clear = HeroData.getObject();
  var heroes_data = new CheetahDota2DataManger(heroes_clear, "heroes");

  CatContainer.render();
  //rendering select on cat
  switch (catid) {
    case cats_nested.general.id:

      break;

    case cats_nested.world.id:

      break;

    case cats_nested.spawns.id:
      var heroes_select = new CheetahSelect2Manager("#heroes", ".heroes", heroes_data, "Select a hero");
      heroes_select.build();
  }

});
