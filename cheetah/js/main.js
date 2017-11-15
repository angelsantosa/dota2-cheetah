var commands_json = "/cheetah/fixtures/commands.json";
var heroes_json = "/cheetah/fixtures/heroes_merge.json";
var items_json = "/cheetah/fixtures/items_merge.json"
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
var ItemData = new CheetahJSONManager(items_json);


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
  var items_clear = sortByField(ItemData.getObject(".{.cat==1}"),"cost");
  var items_extra_clear = sortByField(ItemData.getObject(".{.cat==2}"),"localized_name");

  var heroes_data = new CheetahDota2DataManger(heroes_clear, "heroes");
  var itmes_data = new CheetahDota2DataManger(items_clear, "items");
  var itmes_extra_data = new CheetahDota2DataManger(items_extra_clear, "items");

  CatContainer.render();
  //rendering select on cat
  switch (parseInt(catid)) {
    case cats_nested.general.id:
      var items_select = new CheetahSelect2Manager("#gen_items", ".gen_items", itmes_data, "Select an item");
      var items_extra_select = new CheetahSelect2Manager("#gen_items_extra", ".gen_items_extra", itmes_extra_data, "Select an item");
      items_select.build();
      items_extra_select.build();
      break;

    case cats_nested.spawns.id:
      var heroes_select = new CheetahSelect2Manager("#spwn_heroes", ".spwn_heroes", heroes_data, "Select a hero");
      var items_select = new CheetahSelect2Manager("#spwn_items", ".spwn_items", itmes_data, "Select an item");
      var items_extra_select = new CheetahSelect2Manager("#spwn_items_extra", ".spwn_items_extra", itmes_extra_data, "Select an item");
      heroes_select.build();
      items_select.build();
      items_extra_select.build();
  }

});
